"use server";

import { Session } from "@/lib/Session";
import { notify } from "@/lib/utils";
import { UserServices } from "@/system/Services/UserServices";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";
import { BaseAuthGuard } from "./BaseAuthGuard";

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
    const session = await WorkspaceAuthGuard.requireAuth();

    const workspaceId = session.workspaceId || Session.getWorkspaceId();

    const workspaceExists = await UserServices.hasResource({
      where: { workspaceId },
    });

    if (!workspaceExists) return notify("Workspace not found");

    const workspace = await WorkspaceServices.getResource({
      where: { id: session.workspaceId },
      include: { owner: true },
    });

    if (!workspace) return notify("Workspace not found");

    if (workspace.status !== "ACTIVE") return notify("workspace was not active");

    return true;
  }

  /**
   * Require workspace admin privileges
   * @returns {Promise<boolean>} True if user is workspace admin
   */
  static async requireWorkspaceAdmin() {
    return await WorkspaceAuthGuard.isWorkspaceAdmin();
  }
}

// Exported async functions for use in server components and actions
export async function requireWorkspaceActive() {
  return await WorkspaceAuthGuard.requireWorkspaceActive();
}

export async function requireWorkspaceAdmin() {
  return await WorkspaceAuthGuard.requireWorkspaceAdmin();
}
