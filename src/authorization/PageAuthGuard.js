"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";
import { PermissionServices } from "@/system/Services/PermissionServices";

/**
 * PageAuthGuard - Authorization guard for page-related operations
 *
 * Internal class for page authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class PageAuthGuard extends BaseAuthGuard {
  static async canReadPage() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "READ" },
          { resource: "PAGE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to read page without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to read a page."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canCreatePage() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "CREATE" },
          { resource: "PAGE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to create page without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to create a page."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canUpdatePage() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "UPDATE" },
          { resource: "PAGE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to update page without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a page."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canDeletePage() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "DELETE" },
          { resource: "PAGE" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to delete page without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a page."] },
      };
    }

    return {
      success: true,
    };
  }
}

// Exported async functions for use in server components and actions
export async function canReadPageAuth() {
  return await PageAuthGuard.canReadPage();
}

export async function canCreatePageAuth() {
  return await PageAuthGuard.canCreatePage();
}

export async function canUpdatePageAuth() {
  return await PageAuthGuard.canUpdatePage();
}

export async function canDeletePageAuth() {
  return await PageAuthGuard.canDeletePage();
}
