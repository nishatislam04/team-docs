"use server";

import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { BaseAuthGuard } from "./BaseAuthGuard";

/**
 * UserAuthGuard - Authorization guard for user-related operations
 *
 * Internal class for user authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class UserAuthGuard extends BaseAuthGuard {
  /**
   * Protect any user-authenticated route
   * @returns {Promise<Object>} User session object
   */
  static async protect() {
    return await UserAuthGuard.requireAuth();
  }

  static async canReadUser() {
    const session = await UserAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    if (UserAuthGuard.isSuperAdmin(session)) return { success: true };

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "READ" },
          { resource: "USER" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to read user without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to read a user."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canCreateUser() {
    const session = await UserAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "CREATE" },
          { resource: "USER" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to create user without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to create a user."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canUpdateUser() {
    const session = await UserAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    // check if user exist before udpate

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "UPDATE" },
          { resource: "USER" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to update user without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a user."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canDeleteUser() {
    const session = await UserAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    // check if user exist before delete

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "DELETE" },
          { resource: "USER" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(permission)) {
      Logger.warn(`User ${session.id} attempted to delete user without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a user."] },
      };
    }

    return {
      success: true,
    };
  }
}

// Exported async functions for use in server components and actions
export async function canReadUserAuth() {
  return await UserAuthGuard.canReadUser();
}

export async function canCreateUserAuth() {
  return await UserAuthGuard.canCreateUser();
}

export async function canUpdateUserAuth() {
  return await UserAuthGuard.canUpdateUser();
}

export async function canDeleteUserAuth() {
  return await UserAuthGuard.canDeleteUser();
}
