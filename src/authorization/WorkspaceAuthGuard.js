"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";
import { UserServices } from "@/system/Services/UserServices";
import { Session } from "@/lib/Session";

/**
 * WorkspaceAuthGuard - Authorization guard for workspace-related operations
 *
 * Internal class for workspace authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class WorkspaceAuthGuard extends BaseAuthGuard {
  /**
   * Require workspace to be active
   * @returns {Promise<boolean>} True if workspace is active
   */
  static async requireWorkspaceActive() {
    const session = await this.requireAuth();

    if (!session) return this.redirectUnauthorized();

    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const workspaceExists = await UserServices.hasResource({
      where: { workspaceId },
    });
    if (!workspaceExists) return this.redirectUnauthorized();

    const workspace = await WorkspaceServices.getResource({
      where: { id: session.workspaceId },
      include: { owner: true },
    });

    if (!workspace) return this.redirectUnauthorized();

    if (workspace.status !== "ACTIVE") return this.redirectUnauthorized();

    return true;
  }

  /**
   * Require workspace admin privileges
   * @returns {Promise<boolean>} True if user is workspace admin
   */
  static async requireWorkspaceAdmin() {
    return await this.isWorkspaceAdmin();
  }
}

// Exported async functions for use in server components and actions
export async function requireWorkspaceActive() {
  return await WorkspaceAuthGuard.requireWorkspaceActive();
}

export async function requireWorkspaceAdmin() {
  return await WorkspaceAuthGuard.requireWorkspaceAdmin();
}
