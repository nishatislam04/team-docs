"use server";

import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { Session } from "@/lib/Session";

/**
 * RoleAuthGuard - Authorization guard for role-related operations
 *
 * Internal class for role authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class RoleAuthGuard extends BaseAuthGuard {
  static async canViewRoles() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "READ" },
          { resource: "ROLE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to view roles without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to view roles."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canCreateRole() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "CREATE" },
          { resource: "ROLE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to create role without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to create a role."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canUpdateRole(roleId) {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    // check role exist
    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "UPDATE" },
          { resource: "ROLE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to update role without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a role."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canDeleteRole(roleId) {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    // check role exist
    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "DELETE" },
          { resource: "ROLE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to delete role without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a role."] },
      };
    }

    return {
      success: true,
    };
  }
}

// Exported async functions for use in server components and actions
export async function canViewRolesAuth() {
  return await RoleAuthGuard.canViewRoles();
}

export async function canCreateRoleAuth() {
  return await RoleAuthGuard.canCreateRole();
}

export async function canUpdateRoleAuth(roleId) {
  return await RoleAuthGuard.canUpdateRole(roleId);
}

export async function canDeleteRoleAuth(roleId) {
  return await RoleAuthGuard.canDeleteRole(roleId);
}
