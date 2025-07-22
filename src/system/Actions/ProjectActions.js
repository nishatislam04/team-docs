"use server";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { BaseAction } from "./BaseAction";
import { ProjectModel } from "../Models/ProjectModel";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { WorkspaceService } from "../Services/WorkspaceService";
import { ProjectService } from "../Services/ProjectServices";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";

class ProjectAction extends BaseAction {
  static get schema() {
    return ProjectSchema;
  }

  static async create(formData) {
    await requireWorkspaceAdmin();

    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();
      const workspace = await WorkspaceService.getResource({
        where: { ownerId: session.id },
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
    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      await ProjectService.updateResource(projectId, result.data);

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

    try {
      await ProjectService.deleteResource(projectId);

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
