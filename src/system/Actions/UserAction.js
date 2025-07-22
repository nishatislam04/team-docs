"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { AdminUpdatingUserSchema, UserSchema } from "@/lib/schemas/UserSchema";
import { UserModel } from "../Models/UserModel";
import bcrypt from "bcryptjs";
import { WorkspaceMemberModel } from "../Models/WorkspaceMemberModel";
import { RoleService } from "../Services/RoleServices";
import { requireWorkspaceAdmin } from "@/authorization/WorkspaceAuthGuard";

class UserActions extends BaseAction {
  static get schema() {
    return UserSchema;
  }

  /**
   * This user is created by workspace admin
   * @param {*} formData
   * @returns
   */
  static async create(formData) {
    await requireWorkspaceAdmin();

    const result = await this.execute(formData);

    if (!result.success) return result;

    try {
      const session = await Session.getCurrentUser();
      const hashedPassword = await bcrypt.hash(result.data.password, 10);

      const user = await UserModel.create({
        ...result.data,
        status: "ACTIVE",
        workspaceId: session.workspaceId,
        password: hashedPassword,
      });

      const role = await RoleService.getResource({
        where: {
          name: "DEVELOPER",
        },
        select: {
          id: true,
        },
      });

      // also inject the user to workspace members model
      await WorkspaceMemberModel.create({
        workspaceId: user.workspaceId,
        userId: user.id,
        roleId: role.id,
        joinedAt: user.createdAt,
      });

      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/users",
      };
    } catch (error) {
      Logger.error(error.message, `User Create fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["username", "email", "password"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to create User"] },
        data: result.data,
      };
    }
  }

  static async delete(userId) {
    await requireWorkspaceAdmin();

    try {
      await UserModel.delete({
        where: {
          id: userId,
        },
      });

      return {
        success: true,
        type: "success",
        redirectTo: "/users",
      };
    } catch (error) {
      Logger.error(error.message, `User Delete fail`);
      if (error.code) return PrismaErrorFormatter.handle(error, null, ["id"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to delete User"] },
      };
    }
  }

  static async update(formData) {
    await requireWorkspaceAdmin();

    const result = await this.execute(formData, AdminUpdatingUserSchema);

    if (!result.success) return result;

    try {
      await UserModel.update({
        where: {
          id: result.data.id,
        },
        data: {
          ...result.data,
        },
      });

      return {
        data: result.data,
        success: true,
        type: "success",
        redirectTo: "/users",
      };
    } catch (error) {
      Logger.error(error.message, `User Update fail`);
      if (error.code)
        return PrismaErrorFormatter.handle(error, result.data, ["username", "email", "password"]);

      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to update User"] },
        data: result.data,
      };
    }
  }
}

export async function createUser(formData) {
  return await UserActions.create(formData);
}

export async function deleteUser(userId) {
  return await UserActions.delete(userId);
}

export async function AdminUpdatingUser(formData) {
  return await UserActions.update(formData);
}
