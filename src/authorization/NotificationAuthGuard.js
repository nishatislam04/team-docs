"use server";
import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";

/**
 * NotificationAuthGuard - Authorization guard for notification-related operations
 *
 * Internal class for notification authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class NotificationAuthGuard extends BaseAuthGuard {
  /**
   * Protect notification access - users can only access their own notifications
   * @param {string} notificationId - Notification ID to access
   * @returns {Promise<Object>} Notification object if authorized
   */
  static async protect(notificationId) {
    const session = await NotificationAuthGuard.requireAuth();

    const notification = await NotificationAuthGuard.validateResourceExists(
      (where) => prisma.notification.findUnique(where),
      { where: { id: notificationId } },
      "Notification",
    );

    // Super admins can access any notification
    if (NotificationAuthGuard.isSuperAdmin(session)) {
      return notification;
    }

    // Users can only access their own notifications
    if (!NotificationAuthGuard.isOwner(notification.userId)) {
      Logger.warn(
        `User ${session.id} attempted to access notification ${notificationId} belonging to user ${notification.userId}`,
      );
      NotificationAuthGuard.redirectUnauthorized();
    }

    return notification;
  }

  /**
   * Protect notification creation (system/admin operation)
   * @param {string} targetUserId - User ID to create notification for
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectCreation(targetUserId) {
    const session = await NotificationAuthGuard.requireAuth();

    // Check if user can create notifications for the target user
    const canCreate = await NotificationAuthGuard.canCreateNotification(session.id, targetUserId);
    if (!canCreate) {
      Logger.warn(
        `User ${session.id} attempted to create notification for user ${targetUserId} without permission`,
      );
      NotificationAuthGuard.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect notification update operations (mark as read, etc.)
   * @param {string} notificationId - Notification ID to update
   * @returns {Promise<Object>} Notification object if authorized
   */
  static async protectUpdate(notificationId) {
    const session = await NotificationAuthGuard.requireAuth();

    const notification = await NotificationAuthGuard.protect(notificationId);

    // Users can only update their own notifications
    if (
      !NotificationAuthGuard.isSuperAdmin(session) &&
      !NotificationAuthGuard.isOwner(notification.userId)
    ) {
      Logger.warn(
        `User ${session.id} attempted to update notification ${notificationId} without permission`,
      );
      NotificationAuthGuard.redirectUnauthorized();
    }

    return notification;
  }

  /**
   * Protect notification deletion
   * @param {string} notificationId - Notification ID to delete
   * @returns {Promise<Object>} Notification object if authorized
   */
  static async protectDeletion(notificationId) {
    const session = await NotificationAuthGuard.requireAuth();

    const notification = await NotificationAuthGuard.protect(notificationId);

    // Users can delete their own notifications, admins can delete any
    if (
      !NotificationAuthGuard.isSuperAdmin(session) &&
      !NotificationAuthGuard.isOwner(notification.userId)
    ) {
      Logger.warn(
        `User ${session.id} attempted to delete notification ${notificationId} without permission`,
      );
      NotificationAuthGuard.redirectUnauthorized();
    }

    return notification;
  }

  /**
   * Protect notification list access with filtering
   * @param {string} userId - User ID to get notifications for
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Session and authorized filters
   */
  static async protectList(userId, filters = {}) {
    const session = await NotificationAuthGuard.requireAuth();

    // Super admins can access any user's notifications
    if (NotificationAuthGuard.isSuperAdmin(session)) {
      return {
        session,
        filters: { ...filters, userId },
      };
    }

    // Users can only access their own notifications
    if (!NotificationAuthGuard.isOwner(userId)) {
      Logger.warn(`User ${session.id} attempted to access notifications for user ${userId}`);
      NotificationAuthGuard.redirectUnauthorized();
    }

    return {
      session,
      filters: { ...filters, userId: session.id },
    };
  }

  /**
   * Protect bulk notification operations (mark all as read, delete all, etc.)
   * @param {string} userId - User ID for bulk operations
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectBulkOperations(userId) {
    const session = await NotificationAuthGuard.requireAuth();

    // Super admins can perform bulk operations on any user's notifications
    if (NotificationAuthGuard.isSuperAdmin(session)) {
      return session;
    }

    // Users can only perform bulk operations on their own notifications
    if (!NotificationAuthGuard.isOwner(userId)) {
      Logger.warn(`User ${session.id} attempted bulk notification operations for user ${userId}`);
      NotificationAuthGuard.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect notification broadcasting/sending operations
   * @param {Array} targetUserIds - Array of user IDs to send notifications to
   * @param {string} notificationType - Type of notification
   * @returns {Promise<Object>} Session and authorized targets
   */
  static async protectBroadcast(targetUserIds, notificationType) {
    const session = await NotificationAuthGuard.requireAuth();

    // Check if user can broadcast this type of notification
    const canBroadcast = await NotificationAuthGuard.canBroadcastNotification(
      session.id,
      notificationType,
    );
    if (!canBroadcast) {
      Logger.warn(
        `User ${session.id} attempted to broadcast ${notificationType} notifications without permission`,
      );
      NotificationAuthGuard.redirectUnauthorized();
    }

    // Filter target users based on permissions
    const authorizedTargets = await NotificationAuthGuard.getAuthorizedNotificationTargets(
      session.id,
      targetUserIds,
    );

    return { session, authorizedTargets };
  }

  /**
   * Check if user can create notifications for target user
   * @param {string} userId - User ID creating notification
   * @param {string} targetUserId - Target user ID
   * @returns {Promise<boolean>} True if user can create notification
   */
  static async canCreateNotification(userId, targetUserId) {
    try {
      const session = await NotificationAuthGuard.getSession();

      // Super admins can create notifications for anyone
      if (NotificationAuthGuard.isSuperAdmin(session)) return true;

      // Users can create notifications for themselves (self-notifications)
      if (userId === targetUserId) return true;

      // Check if users are in the same workspace (for workspace notifications)
      const sharedWorkspaces = await NotificationAuthGuard.getSharedWorkspaces(
        userId,
        targetUserId,
      );
      if (sharedWorkspaces.length > 0) {
        // Check if user has notification permission in any shared workspace
        for (const workspaceId of sharedWorkspaces) {
          const hasPermission = await NotificationAuthGuard.hasPermission(
            userId,
            "create:notification",
            "workspace",
            workspaceId,
          );
          if (hasPermission) return true;
        }
      }

      return false;
    } catch (error) {
      Logger.error("Failed to check notification creation permission", error);
      return false;
    }
  }

  /**
   * Check if user can broadcast notifications of given type
   * @param {string} userId - User ID
   * @param {string} notificationType - Notification type
   * @returns {Promise<boolean>} True if user can broadcast
   */
  static async canBroadcastNotification(userId, notificationType) {
    try {
      const session = await NotificationAuthGuard.getSession();

      // Super admins can broadcast any notification type
      if (NotificationAuthGuard.isSuperAdmin(session)) return true;

      // Define which notification types require special permissions
      const restrictedTypes = ["system_announcement", "maintenance_alert", "security_notice"];

      if (restrictedTypes.includes(notificationType)) {
        // Only admins can broadcast restricted notification types
        return false;
      }

      // For other types, check if user has broadcast permission
      return await NotificationAuthGuard.hasPermission(userId, "broadcast:notification", "system");
    } catch (error) {
      Logger.error("Failed to check notification broadcast permission", error);
      return false;
    }
  }

  /**
   * Get shared workspaces between two users
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @returns {Promise<Array>} Array of shared workspace IDs
   */
  static async getSharedWorkspaces(userId1, userId2) {
    try {
      const user1Workspaces = await prisma.workspaceMember.findMany({
        where: { userId: userId1 },
        select: { workspaceId: true },
      });

      const user2Workspaces = await prisma.workspaceMember.findMany({
        where: { userId: userId2 },
        select: { workspaceId: true },
      });

      const user1WorkspaceIds = user1Workspaces.map((w) => w.workspaceId);
      const user2WorkspaceIds = user2Workspaces.map((w) => w.workspaceId);

      return user1WorkspaceIds.filter((id) => user2WorkspaceIds.includes(id));
    } catch (error) {
      Logger.error("Failed to get shared workspaces", error);
      return [];
    }
  }

  /**
   * Get authorized notification targets from a list of user IDs
   * @param {string} userId - User ID sending notifications
   * @param {Array} targetUserIds - Array of target user IDs
   * @returns {Promise<Array>} Array of authorized target user IDs
   */
  static async getAuthorizedNotificationTargets(userId, targetUserIds) {
    try {
      const authorizedTargets = [];

      for (const targetUserId of targetUserIds) {
        const canNotify = await NotificationAuthGuard.canCreateNotification(userId, targetUserId);
        if (canNotify) {
          authorizedTargets.push(targetUserId);
        }
      }

      return authorizedTargets;
    } catch (error) {
      Logger.error("Failed to get authorized notification targets", error);
      return [];
    }
  }

  /**
   * Get user's notification preferences and permissions
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Notification preferences and permissions
   */
  static async getUserNotificationContext(userId) {
    try {
      const session = await NotificationAuthGuard.getSession();

      // Users can only get their own notification context unless admin
      if (!NotificationAuthGuard.isSuperAdmin(session) && session.id !== userId) {
        return null;
      }

      // Get user's workspaces for context
      const workspaces = await prisma.workspaceMember.findMany({
        where: { userId },
        include: {
          workspace: {
            select: { id: true, name: true },
          },
          role: {
            select: { name: true },
          },
        },
      });

      return {
        userId,
        workspaces: workspaces.map((w) => ({
          id: w.workspace.id,
          name: w.workspace.name,
          role: w.role.name,
        })),
        canBroadcast: await NotificationAuthGuard.canBroadcastNotification(userId, "general"),
        isAdmin: NotificationAuthGuard.isSuperAdmin(session),
      };
    } catch (error) {
      Logger.error("Failed to get user notification context", error);
      return null;
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectNotification(notificationId) {
  return await NotificationAuthGuard.protect(notificationId);
}

export async function protectNotificationCreation() {
  return await NotificationAuthGuard.protectCreation();
}

export async function protectNotificationUpdate(notificationId) {
  return await NotificationAuthGuard.protectUpdate(notificationId);
}

export async function protectNotificationDeletion(notificationId) {
  return await NotificationAuthGuard.protectDeletion(notificationId);
}

export async function protectNotificationList(filters = {}) {
  return await NotificationAuthGuard.protectList(filters);
}

export async function protectNotificationBroadcast() {
  return await NotificationAuthGuard.protectBroadcast();
}

export async function protectNotificationManagement() {
  return await NotificationAuthGuard.protectManagement();
}

export async function protectNotificationMarkAsRead(notificationId) {
  return await NotificationAuthGuard.protectMarkAsRead(notificationId);
}

export async function protectNotificationMarkAllAsRead() {
  return await NotificationAuthGuard.protectMarkAllAsRead();
}

export async function getUserNotificationContext() {
  return await NotificationAuthGuard.getUserNotificationContext();
}
