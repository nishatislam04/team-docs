"use server";

import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { BaseAuthGuard } from "./BaseAuthGuard";

/**
 * SectionAuthGuard - Authorization guard for section-related operations
 *
 * Internal class for section authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class SectionAuthGuard extends BaseAuthGuard {
  static async canReadSection() {
    const session = await SectionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    if (SectionAuthGuard.isSuperAdmin(session)) return { success: true };

    const section = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "READ" },
          { resource: "SECTION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(section)) {
      Logger.warn(`User ${session.id} attempted to read section without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to read a section."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canCreateSection() {
    const session = await SectionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const section = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "CREATE" },
          { resource: "SECTION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(section)) {
      Logger.warn(`User ${session.id} attempted to create section without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to create a section."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canUpdateSection() {
    const session = await SectionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const section = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "UPDATE" },
          { resource: "SECTION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(section)) {
      Logger.warn(`User ${session.id} attempted to update section without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a section."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canDeleteSection() {
    const session = await SectionAuthGuard.basicAuthCheck();

    if (session.success === false) return session;

    const section = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "DELETE" },
          { resource: "SECTION" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (!BaseAuthGuard.isPermissionActive(section)) {
      Logger.warn(`User ${session.id} attempted to delete section without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a section."] },
      };
    }

    return {
      success: true,
    };
  }
}

// Exported async functions for use in server components and actions
export async function canReadSectionAuth() {
  return await SectionAuthGuard.canReadSection();
}

export async function canCreateSectionAuth() {
  return await SectionAuthGuard.canCreateSection();
}

export async function canUpdateSectionAuth() {
  return await SectionAuthGuard.canUpdateSection();
}

export async function canDeleteSectionAuth() {
  return await SectionAuthGuard.canDeleteSection();
}
