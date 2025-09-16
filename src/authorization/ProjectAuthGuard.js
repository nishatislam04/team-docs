"use server";

import Logger from "@/lib/Logger";
import { notify } from "@/lib/utils";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { ProjectServices } from "@/system/Services/ProjectServices";
import { BaseAuthGuard } from "./BaseAuthGuard";

/**
 * ProjectAuthGuard - Authorization guard for project-related operations
 *
 * Internal class for project authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class ProjectAuthGuard extends BaseAuthGuard {
  static async canViewProjects() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    // now we check permission model
    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "READ" },
          { resource: "PROJECT" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to view projects without permission`);
      notify("You are not permitted to view this project");
    }

    return {
      success: true,
    };
  }

  /**
   * This is system level checking, if workspace was granted authorization to create project from system
   * @returns
   */
  static async canCreateProject() {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    // now we check permission model
    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "CREATE" },
          { resource: "PROJECT" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to create project without permission`);
      notify("You do not have permission to create a project");
    }

    return {
      success: true,
    };
  }

  // Super admins can create projects in any workspace
  static async canUpdateProject(projectId) {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const projectExist = await ProjectServices.hasResource({
      where: {
        AND: [
          { id: projectId },
          { ownerId: session.id },
          { workspaceId: session.workspaceId },
          { status: "ACTIVE" },
        ],
      },
    });

    if (!projectExist) {
      Logger.warn(`User ${session.id} attempted to update project without project membership`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a project."] },
      };
    }

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "UPDATE" },
          { resource: "PROJECT" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to update project without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to update a project."] },
      };
    }

    return {
      success: true,
    };
  }

  static async canDeleteProject(userId, projectId) {
    const session = await this.basicAuthCheck();

    if (session.success === false) return session;

    const projectExist = await ProjectServices.hasResource({
      where: {
        AND: [
          { id: projectId },
          { ownerId: session.id },
          { workspaceId: session.workspaceId },
          { status: "ACTIVE" },
        ],
      },
    });

    if (!projectExist) {
      Logger.warn(`User ${session.id} attempted to delete project without project membership`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a project."] },
      };
    }

    const permission = await PermissionServices.findFirst({
      where: {
        AND: [
          { workspaceId: session.workspaceId },
          { ownerId: session.id },
          { scope: "SYSTEM" },
          { action: "DELETE" },
          { resource: "PROJECT" },
        ],
      },
      select: {
        status: true,
      },
    });

    if (permission.status !== "ACTIVE") {
      Logger.warn(`User ${session.id} attempted to delete project without permission`);
      return {
        success: false,
        errors: { _form: ["You do not have permission to delete a project."] },
      };
    }

    return {
      success: true,
    };
  }
}

// Exported async functions for use in server components and actions

export async function canViewProjectsAuth() {
  return await ProjectAuthGuard.canViewProjects();
}

export async function canCreateProjectAuth() {
  return await ProjectAuthGuard.canCreateProject();
}

export async function canUpdateProjectAuth(projectId) {
  return await ProjectAuthGuard.canUpdateProject(projectId);
}

export async function canDeleteProjectAuth(projectId) {
  return await ProjectAuthGuard.canDeleteProject(projectId);
}
