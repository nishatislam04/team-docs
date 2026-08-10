"use server";
import { revalidatePath } from "next/cache";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";
import Logger from "@/lib/Logger";
import { ProjectUserPermissionService } from "../Services/ProjectUserPermissionServices";
import { BaseAction } from "./BaseAction";

class ProjectPermissionAction extends BaseAction {
  static async assignDev(formData) {
    await requireWorkspaceAdmin();

    const result = await ProjectUserPermissionService.assignDev(formData);

    return {
      data: result.data,
      success: true,
      type: "success",
    };
  }

  static async removeDevFromProject(formData) {
    await requireWorkspaceAdmin();

    try {
      await ProjectUserPermissionService.removeDevFromProject(formData);

      revalidatePath("/projects/[slug]/assign-dev");

      return {
        success: true,
        type: "success",
        message: "Developer & permission successfully deleted",
      };
    } catch (error) {
      Logger.error(error.message, "developer & permission deletion failed:");
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete developer & permission"] },
      };
    }
  }

  static async modifyDevPermissions(formData) {
    await requireWorkspaceAdmin();

    const result = await ProjectUserPermissionService.modifyDevPermissions(formData);

    return {
      data: result.data,
      success: true,
    };
  }
}

export async function assignDevAction(formData) {
  return ProjectPermissionAction.assignDev(formData);
}

export async function removeDevFromProjectAction(formData) {
  return ProjectPermissionAction.removeDevFromProject(formData);
}

export async function modifyDevPermissionsAction(formData) {
  return ProjectPermissionAction.modifyDevPermissions(formData);
}
