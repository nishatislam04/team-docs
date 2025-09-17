"use server";
import {
  canCreateProjectAuth,
  canDeleteProjectAuth,
  canUpdateProjectAuth,
} from "@/authorization/ProjectAuthGuard";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";
import Logger from "@/lib/Logger";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { Session } from "@/lib/Session";
import { revalidatePath } from "next/cache";
import { ProjectModel } from "../Models/ProjectModel";
import { ProjectServices } from "../Services/ProjectServices";
import { WorkspaceServices } from "../Services/WorkspaceServices";
import { BaseAction } from "./BaseAction";

class ProjectAction extends BaseAction {
  static get schema() {
    return ProjectSchema;
  }

  static async create(formData) {
    await requireWorkspaceAdmin();
    const projectAuthorization = await canCreateProjectAuth();

    if (!projectAuthorization.success) return projectAuthorization;

    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();

      const workspace = await WorkspaceServices.getResource({
        where: { ownerId: session.id },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      await ProjectModel.create({
        ...result.data,
        workspace: {
          connect: { id: workspace.id },
        },
        owner: {
          connect: { id: session.id },
        },
      });

      revalidatePath("/projects");

      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/projects",
      };
    } catch (error) {
      Logger.error(error.message, "project creation failed:");
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "slug", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create project"] },
        data: result.data,
      };
    }
  }

  static async update(projectId, formData) {
    await requireWorkspaceAdmin();
    const projectAuthorization = await canUpdateProjectAuth(projectId);

    if (!projectAuthorization.success) return projectAuthorization;

    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      await ProjectServices.updateResource(projectId, result.data);

      revalidatePath("/projects");

      return {
        data: result.data,
        success: true,
        type: "success",
      };
    } catch (error) {
      Logger.error(error.message, "project update failed:");
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "slug", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to update project"] },
        data: result.data,
      };
    }
  }

  static async delete(projectId) {
    await requireWorkspaceAdmin();

    const projectAuthorization = await canDeleteProjectAuth(projectId);

    if (!projectAuthorization.success) return projectAuthorization;

    try {
      await ProjectServices.deleteResource(projectId);

      revalidatePath("/projects");

      return {
        success: true,
        type: "success",
        message: "Project successfully deleted",
      };
    } catch (error) {
      Logger.error(error.message, "project deletion failed:");
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete project"] },
      };
    }
  }
}

export async function createProjectAction(formData) {
  return await ProjectAction.create(formData);
}

export async function updateProjectAction(projectId, formData) {
  return await ProjectAction.update(projectId, formData);
}

export async function deleteProjectAction(prevState, projectId) {
  return await ProjectAction.delete(projectId);
}
