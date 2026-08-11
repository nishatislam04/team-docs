"use server";

import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { BaseAuthGuard } from "./BaseAuthGuard";

/**
 * PermissionAuthGuard - Authorization guard for permission-related operations
 *
 * Internal class for permission authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class PermissionAuthGuard extends BaseAuthGuard {
  static async canPermissionView() {
    const session = await PermissionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    if (PermissionAuthGuard.isSuperAdmin(session)) return { success: true };

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "READ" },
          { resource: "PERMISSION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to read permission without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to read a permission."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canPermissionCreate() {
    const session = await PermissionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "CREATE" },
          { resource: "PERMISSION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to create permission without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to create a permission."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canPermissionUpdate() {
    const session = await PermissionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "UPDATE" },
          { resource: "PERMISSION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to update permission without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a permission."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canPermissionDelete() {
    const session = await PermissionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "DELETE" },
          { resource: "PERMISSION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to delete permission without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a permission."] },
      };
    }

    return {
      success: true,
    };
  }

  /**
   * Protect permission access - users can only access their own permissions or system permissions
   * @param {string} permissionId - Permission ID to access
   * @returns {Promise<Object>} Permission object if authorized
   */
  static async protect(permissionId) {
    const session = await PermissionAuthGuard.requireAuth();

    const permission = await PermissionAuthGuard.validateResourceExists(
      (where) => prisma.permission.findUnique(where),
      { where: { id: permissionId } },
      "Permission",
    );

    // Super admins can access any permission
    if (PermissionAuthGuard.isSuperAdmin(session)) {
      return permission;
    }

    // Users can only access their own created permissions
    if (permission.ownerId && !PermissionAuthGuard.isOwner(permission.ownerId)) {
      Logger.warn(
        `User ${session.id} attempted to access permission ${permissionId} without ownership`,
      );
      PermissionAuthGuard.redirectUnauthorized();
    }

    return permission;
  }

  /**
   * Protect permission creation
   * @returns {Promise<Object>} User session if authorized
   */
  static async protectCreation() {
    const session = await PermissionAuthGuard.requireAuth();

    // Check if user can create permissions
    const canCreate = await PermissionAuthGuard.canCreatePermission(session.id);
    if (!canCreate) {
      Logger.warn(`User ${session.id} attempted to create permission without authorization`);
      PermissionAuthGuard.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect permission update operations
   * @param {string} permissionId - Permission ID to update
   * @param {Object} updateData - Data being updated
   * @returns {Promise<Object>} Permission object if authorized
   */
  static async protectUpdate(permissionId, updateData = {}) {
    const session = await PermissionAuthGuard.requireAuth();

    const permission = await PermissionAuthGuard.validateResourceExists(
      (where) => prisma.permission.findUnique(where),
      { where: { id: permissionId } },
      "Permission",
    );

    // System permissions (no owner) can only be updated by super admins
    if (!permission.ownerId && !PermissionAuthGuard.isSuperAdmin(session)) {
      Logger.warn(`User ${session.id} attempted to update system permission ${permissionId}`);
      PermissionAuthGuard.redirectUnauthorized();
    }

    // Custom permissions can only be updated by their owners or super admins
    if (permission.ownerId && !PermissionAuthGuard.isSuperAdmin(session)) {
      PermissionAuthGuard.requireOwnership(permission.ownerId, "permission");
    }

    return permission;
  }

  /**
   * Protect permission deletion
   * @param {string} permissionId - Permission ID to delete
   * @returns {Promise<Object>} Permission object if authorized
   */
  static async protectDeletion(permissionId) {
    const session = await PermissionAuthGuard.requireAuth();

    const permission = await PermissionAuthGuard.validateResourceExists(
      (where) => prisma.permission.findUnique(where),
      { where: { id: permissionId } },
      "Permission",
    );

    // System permissions cannot be deleted
    if (!permission.ownerId) {
      Logger.warn(`User ${session.id} attempted to delete system permission ${permissionId}`);
      PermissionAuthGuard.redirectUnauthorized();
    }

    // Custom permissions can only be deleted by their owners or super admins
    if (!PermissionAuthGuard.isSuperAdmin(session)) {
      PermissionAuthGuard.requireOwnership(permission.ownerId, "permission");
    }

    // Check if permission is in use before deletion
    const isInUse = await PermissionAuthGuard.isPermissionInUse(permissionId);
    if (isInUse) {
      Logger.warn(
        `User ${session.id} attempted to delete permission ${permissionId} that is in use`,
      );
      throw new Error("Cannot delete permission that is currently assigned to roles or users");
    }

    return permission;
  }

  /**
   * Protect permission assignment to roles
   * @param {string} permissionId - Permission ID to assign
   * @param {string} roleId - Role ID to assign permission to
   * @returns {Promise<Object>} Permission and role info
   */
  static async protectRoleAssignment(permissionId, roleId) {
    const session = await PermissionAuthGuard.requireAuth();

    const permission = await PermissionAuthGuard.protect(permissionId);

    const role = await PermissionAuthGuard.validateResourceExists(
      (where) => prisma.role.findUnique(where),
      { where: { id: roleId } },
      "Role",
    );

    // Check if user can assign permissions to this role
    const canAssign = await PermissionAuthGuard.canAssignPermissionToRole(session.id, roleId);
    if (!canAssign) {
      Logger.warn(
        `User ${session.id} attempted to assign permission ${permissionId} to role ${roleId} without authorization`,
      );
      PermissionAuthGuard.redirectUnauthorized();
    }

    return { permission, role };
  }

  /**
   * Protect direct permission assignment to users
   * @param {string} permissionId - Permission ID to assign
   * @param {string} userId - User ID to assign permission to
   * @param {string} projectId - Project ID for scoped permissions
   * @returns {Promise<Object>} Permission and assignment info
   */
  static async protectUserAssignment(permissionId, userId, projectId) {
    const session = await PermissionAuthGuard.requireAuth();

    const permission = await PermissionAuthGuard.protect(permissionId);

    // Check if user can assign permissions in this project
    const canAssign = await PermissionAuthGuard.canAssignPermissionToUser(session.id, projectId);
    if (!canAssign) {
      Logger.warn(
        `User ${session.id} attempted to assign permission ${permissionId} to user ${userId} in project ${projectId} without authorization`,
      );
      PermissionAuthGuard.redirectUnauthorized();
    }

    return { permission, canAssign: true };
  }

  /**
   * Protect permission list access with filtering
   * @param {Object} filters - Optional filters for permission list
   * @returns {Promise<Object>} Session and authorized filters
   */
  static async protectList(filters = {}) {
    const session = await PermissionAuthGuard.requireAuth();

    // Super admins can see all permissions
    if (PermissionAuthGuard.isSuperAdmin(session)) {
      return { session, filters };
    }

    // Regular users can only see their own permissions
    return {
      session,
      filters: {
        ...filters,
        ownerId: session.id,
      },
    };
  }

  /**
   * Protect permission scope access
   * @param {string} scope - Permission scope to access
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectScopeAccess(scope) {
    const session = await PermissionAuthGuard.requireAuth();

    // Check if user can access permissions for this scope
    const canAccess = await PermissionAuthGuard.canAccessPermissionScope(session.id, scope);
    if (!canAccess) {
      Logger.warn(
        `User ${session.id} attempted to access permissions for scope ${scope} without authorization`,
      );
      PermissionAuthGuard.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Check if user can create permissions
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user can create permissions
   */
  // static async canCreatePermission(userId) {
  //   try {
  //     // For now, all authenticated users can create custom permissions
  //     // This could be extended to check workspace limits, etc.
  //     return true;
  //   } catch (error) {
  //     Logger.error("Failed to check permission creation authorization", error);
  //     return false;
  //   }
  // }

  /**
   * Check if user can assign permissions to roles
   * @param {string} userId - User ID
   * @param {string} roleId - Role ID
   * @returns {Promise<boolean>} True if user can assign permissions
   */
  static async canAssignPermissionToRole(userId, roleId) {
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        select: { ownerId: true, isSystem: true },
      });

      if (!role) return false;

      // System roles can only be modified by super admins
      if (role.isSystem) {
        const session = await PermissionAuthGuard.getSession();
        return PermissionAuthGuard.isSuperAdmin(session);
      }

      // Custom roles can be modified by their owners
      return role.ownerId === userId;
    } catch (error) {
      Logger.error("Failed to check permission assignment authorization", error);
      return false;
    }
  }

  /**
   * Check if user can assign permissions to users in project
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} True if user can assign permissions
   */
  static async canAssignPermissionToUser(userId, projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { workspace: true },
      });

      if (!project) return false;

      // Project owners can assign permissions
      if (project.ownerId === userId) return true;

      // Workspace owners can assign permissions in their projects
      if (project.workspace.ownerId === userId) return true;

      // Check for permission assignment capability
      return await PermissionAuthGuard.hasPermission(
        userId,
        "assign:permission",
        "project",
        projectId,
      );
    } catch (error) {
      Logger.error("Failed to check user permission assignment authorization", error);
      return false;
    }
  }

  /**
   * Check if user can access permissions for given scope
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @returns {Promise<boolean>} True if user can access scope
   */
  static async canAccessPermissionScope(userId, scope) {
    try {
      // All authenticated users can access basic scopes
      const allowedScopes = ["workspace", "project", "page", "user"];
      return allowedScopes.includes(scope);
    } catch (error) {
      Logger.error("Failed to check permission scope access", error);
      return false;
    }
  }

  /**
   * Check if permission is currently in use
   * @param {string} permissionId - Permission ID
   * @returns {Promise<boolean>} True if permission is in use
   */
  static async isPermissionInUse(permissionId) {
    try {
      const roleUsage = await prisma.rolePermissionAssignment.count({
        where: { permissionId },
      });

      const userUsage = await prisma.projectUserPermission.count({
        where: { permissionId },
      });

      return roleUsage > 0 || userUsage > 0;
    } catch (error) {
      Logger.error("Failed to check permission usage", error);
      return true; // Err on the side of caution
    }
  }

  /**
   * Get permissions available to user for given scope
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @returns {Promise<Array>} Available permissions
   */
  static async getAvailablePermissions(userId, scope = null) {
    try {
      const session = await PermissionAuthGuard.getSession();

      if (PermissionAuthGuard.isSuperAdmin(session)) {
        // Super admins can see all permissions
        return await prisma.permission.findMany({
          where: scope ? { scope } : undefined,
          orderBy: { name: "asc" },
        });
      }

      // Regular users can see their own permissions
      return await prisma.permission.findMany({
        where: {
          ownerId: userId,
          ...(scope && { scope }),
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      Logger.error("Failed to get available permissions", error);
      return [];
    }
  }
}

// Exported async functions for use in server components and actions
export async function canPermissionViewAuth() {
  return await PermissionAuthGuard.canPermissionView();
}

export async function canCreatePermissionAuth() {
  return await PermissionAuthGuard.canPermissionCreate();
}

export async function canUpdatePermissionAuth() {
  return await PermissionAuthGuard.canPermissionUpdate();
}

export async function canDeletePermissionAuth() {
  return await PermissionAuthGuard.canPermissionDelete();
}

export async function protectPermission(permissionId) {
  return await PermissionAuthGuard.protect(permissionId);
}

export async function protectPermissionCreation() {
  return await PermissionAuthGuard.protectCreation();
}

export async function protectPermissionUpdate(permissionId) {
  return await PermissionAuthGuard.protectUpdate(permissionId);
}

export async function protectPermissionDeletion(permissionId) {
  return await PermissionAuthGuard.protectDeletion(permissionId);
}

export async function protectPermissionAssignment(permissionId, targetUserId, scope, resourceId) {
  return await PermissionAuthGuard.protectAssignment(permissionId, targetUserId, scope, resourceId);
}

export async function protectPermissionList(filters = {}) {
  return await PermissionAuthGuard.protectList(filters);
}

export async function protectPermissionManagement() {
  return await PermissionAuthGuard.protectManagement();
}

export async function protectPermissionRoleAssignment(permissionId, roleId) {
  return await PermissionAuthGuard.protectRoleAssignment(permissionId, roleId);
}

export async function protectPermissionSystemManagement() {
  return await PermissionAuthGuard.protectSystemManagement();
}

export async function getAvailablePermissions(scope = null) {
  return await PermissionAuthGuard.getAvailablePermissions(scope);
}
