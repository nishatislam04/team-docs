"use server";

import { revalidatePath } from "next/cache";
import {
  canCreatePermissionAuth,
  canDeletePermissionAuth,
  canUpdatePermissionAuth,
} from "@/authorization/PermissionAuthGuard";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";
import Logger from "@/lib/Logger";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { Session } from "@/lib/Session";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { PermissionModel } from "../Models/PermissionModel";
import { PermissionServices } from "../Services/PermissionServices";
import { BaseAction } from "./BaseAction";

class PermissionActions extends BaseAction {
  static get schema() {
    return PermissionSchema;
  }

  static async create(formData) {
    await requireWorkspaceAdmin();

    const permission = await canCreatePermissionAuth();
    if (permission.success === false) return permission;

    const result = await PermissionActions.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();
      await PermissionModel.create({
        ...result.data,
        status: "ACTIVE",
        scope: "WORKSPACE",
        ownerId: session.id,
        workspaceId: session.workspaceId,
      });

      revalidatePath("/permissions", "page");
      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/permissions",
      };
    } catch (error) {
      Logger.error(error.message, `Permission Create fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "description", "scope"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create Permission"] },
        data: result.data,
      };
    }
  }

  static async update(permissionId, formData) {
    await requireWorkspaceAdmin();

    const permission = await canUpdatePermissionAuth();
    if (permission.success === false) return permission;

    const result = await PermissionActions.execute(formData);

    if (!result.success) return result;

    try {
      await PermissionServices.updateResource(permissionId, result.data);

      revalidatePath("/permissions", "page");
      return {
        data: result.data,
        success: true,
        type: "success",
      };
    } catch (error) {
      Logger.error(error.message, "permission update failed:");
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["name", "scope", "description"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to update permission"] },
        data: result.data,
      };
    }
  }

  static async delete(permissionId) {
    await requireWorkspaceAdmin();

    const permission = await canDeletePermissionAuth();
    if (permission.success === false) return permission;

    try {
      await PermissionServices.deleteResource(permissionId);

      revalidatePath("/permissions", "page");
      return {
        success: true,
        type: "success",
        message: "Permission successfully deleted",
      };
    } catch (error) {
      Logger.error(error.message, "permission deletion failed:");
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete permission"] },
      };
    }
  }
}

export async function createPermissions(formData) {
  return await PermissionActions.create(formData);
}

export async function updatePermissionAction({ permissionId, formData }) {
  return await PermissionActions.update(permissionId, formData);
}

export async function deletePermissionAction(prevState, permissionId) {
  return await PermissionActions.delete(permissionId);
}
