"use server";

import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { BaseAction } from "./BaseAction";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "../Services/WorkspaceService";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PermissionModel } from "../Models/PermissionModel";

class WorkspaceAction extends BaseAction {
  static get schema() {
    return WorkspaceSchema;
  }

  static async create(formData) {
    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();

      const createdWorkspace = await WorkspaceModel.create({
        ...result.data,
        ownerId: session.id,
      });

      await WorkspaceService.assignWorkspaceToUser(createdWorkspace.id, session.id);

      revalidatePath("(home)/", "layout");
      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/projects",
      };
    } catch (error) {
      Logger.error(error.message, "Workspace creation failed:");
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "slug", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create workspace"] },
        data: result.data,
      };
    }
  }

  /**
   * Approve a workspace by updating its status to ACTIVE
   * @param {string} workspaceId - The ID of the workspace to approve
   * @returns {Object} Action result with success/error status
   */
  static async approve(workspaceId) {
    try {
      // Validate workspace ID
      const workspaceIdSchema = z.string().cuid("Invalid workspace ID");
      const validatedId = workspaceIdSchema.parse(workspaceId);

      // Ensure user is authenticated and has admin privileges
      await Session.requireAuth();

      // Check if workspace exists and is pending
      const workspace = await WorkspaceModel.findUnique({
        where: { id: validatedId },
        include: { owner: { select: { id: true, username: true, email: true } } },
      });

      Logger.info(workspace, "Workspace found");

      if (!workspace) {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["Workspace not found"] },
        };
      }

      if (workspace.status !== "PENDING") {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["Workspace is not pending approval"] },
        };
      }

      // Update workspace status to ACTIVE
      await WorkspaceModel.update({
        where: { id: validatedId },
        data: { status: "ACTIVE" },
      });

      // generate permissions for this workspace
      await this.generatePermissions(validatedId, workspace.owner.id);

      // Revalidate all admin routes to refresh sidebar badge and other data
      revalidatePath("/admin", "layout");

      return {
        success: true,
        type: "success",
        message: `Workspace "${workspace.name}" has been approved successfully`,
      };
    } catch (error) {
      Logger.error(error.message, "Workspace approval failed:");

      if (error.name === "ZodError") {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["Invalid workspace ID"] },
        };
      }

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to approve workspace"] },
      };
    }
  }

  /**
   * Reject a workspace by updating its status to INACTIVE
   * @param {string} workspaceId - The ID of the workspace to reject
   * @returns {Object} Action result with success/error status
   */
  static async reject(workspaceId) {
    try {
      // Validate workspace ID
      const workspaceIdSchema = z.string().cuid("Invalid workspace ID");
      const validatedId = workspaceIdSchema.parse(workspaceId);

      // Ensure user is authenticated and has admin privileges
      await Session.requireAuth();
      const currentUser = await Session.getCurrentUser();

      // Check if workspace exists and is pending
      const workspace = await WorkspaceModel.findUnique({
        where: { id: validatedId },
        include: { owner: { select: { username: true, email: true } } },
      });

      if (!workspace) {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["Workspace not found"] },
        };
      }

      if (workspace.status !== "PENDING") {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["Workspace is not pending approval"] },
        };
      }

      // Update workspace status to INACTIVE
      await WorkspaceModel.update({
        where: { id: validatedId },
        data: { status: "INACTIVE" },
      });

      // Revalidate all admin routes to refresh sidebar badge and other data
      revalidatePath("/admin", "layout");

      Logger.info(`Workspace ${workspace.name} rejected by admin ${currentUser.username}`);

      return {
        success: true,
        type: "success",
        message: `Workspace "${workspace.name}" has been rejected`,
      };
    } catch (error) {
      Logger.error(error.message, "Workspace rejection failed:");

      if (error.name === "ZodError") {
        return {
          success: false,
          type: "fail",
          errors: { _form: ["Invalid workspace ID"] },
        };
      }

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to reject workspace"] },
      };
    }
  }

  static async generatePermissions(workspaceId, ownerId) {
    const resources = ["PROJECT", "USER", "ROLE", "PERMISSION", "SECTION", "PAGE"];
    const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

    try {
      // Create workspace-level permissions for the owner
      for (const resource of resources) {
        for (const action of actions) {
          await PermissionModel.create({
            workspaceId,
            name: `${action} ${resource}`,
            scope: "WORKSPACE",
            action,
            resource,
            ownerId,
          });
        }
      }

      return {
        success: true,
        type: "success",
        message: "Permissions generated successfully",
      };
    } catch (error) {
      Logger.error(error.message, "Failed to generate permissions");

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to generate permissions"] },
      };
    }
  }

  /**
   * Get pending workspace count for admin sidebar badge
   * @returns {Promise<Object>} Result object with count data
   */
  static async getPendingCount() {
    try {
      // Ensure user is authenticated and has admin privileges
      await Session.requireAuth();

      // Get the pending workspace count using WorkspaceService
      const count = await WorkspaceService.getPendingWorkspacesCount();

      return {
        success: true,
        type: "success",
        data: { count },
        message: "Pending workspace count retrieved successfully",
      };
    } catch (error) {
      Logger.error(error.message, "Failed to get pending workspace count");

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to get pending workspace count"] },
      };
    }
  }
}

export async function createWorkspace(prevState, formData) {
  return await WorkspaceAction.create(formData);
}

export async function approveWorkspace(workspaceId) {
  return await WorkspaceAction.approve(workspaceId);
}

export async function rejectWorkspace(workspaceId) {
  return await WorkspaceAction.reject(workspaceId);
}

export async function getPendingWorkspaceCount() {
  return await WorkspaceAction.getPendingCount();
}
