"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { RolePermissionAssignSchema } from "@/lib/schemas/RolePermissionAssignSchema";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";
import { RolePermissionAssignServices } from "../Services/RolePermissionAssignServices";

class RolePermissionAssignActions extends BaseAction {
  static get schema() {
    return RolePermissionAssignSchema;
  }

  static async create(formData) {
    await requireWorkspaceAdmin();

    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();
      const { roleId, permissions } = result.data;

      await RolePermissionAssignServices.performPermissionAssignment({
        roleId,
        permissions,
        ownerId: session.id,
        workspaceId: session.workspaceId,
      });

      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/roles",
      };
    } catch (error) {
      Logger.error(error.message, `role permission assignment fail`);
      if (error.code) return PrismaErrorFormatter.handle(error, result.data, ["permissions"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to assign permission to role"] },
        data: result.data,
      };
    }
  }
}

export async function assignPermissionsToRole(roleId, formData) {
  return await RolePermissionAssignActions.create({
    roleId,
    permissions: formData.permissions,
  });
}
