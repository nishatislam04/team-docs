import Logger from "@/lib/Logger";
import { PermissionDTO } from "../DTOs/PermissionDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { BaseService } from "./BaseService";

export class PermissionServices extends BaseService {
  static modelName = "permission";
  static dto = PermissionDTO;

  static async updateResource(id, data) {
    try {
      const updatedPermission = await PermissionModel.update({
        where: { id },
        data,
      });

      const permissionDTO = PermissionDTO.toResponse(updatedPermission);
      return permissionDTO;
    } catch (error) {
      Logger.error(error.message, `Permission update fail`);
      throw error;
    }
  }

  static async deleteResource(id) {
    try {
      await PermissionModel.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      Logger.error(error.message, `Permission delete fail`);
      throw error;
    }
  }

  /**
   * active or inactive permission from super admin panel
   * workspace permission management
   * @param {*} id
   * @param {*} status
   * @returns
   */
  static async updatePermissionStatus(id, status) {
    try {
      await PermissionModel.update({
        where: { id },
        data: { status },
      });

      return {
        success: true,
        type: "success",
        message: "Action Successful",
      };
    } catch (error) {
      Logger.error(error.message, `Permission update fail`);
      return {
        success: false,
        type: "fail",
        errors: { _form: ["Failed to update permission status"] },
      };
    }
  }

  static async getPermissionForProjectScope(projectName) {
    try {
      const permissions = await PermissionModel.findMany({
        where: {
          scope: projectName,
        },
        select: {
          id: true,
          name: true,
        },
      });
      return permissions;
    } catch (error) {
      Logger.error(error.message, `Get permission for project scope failed`);
    }
  }

  /**
   * this is for system workspace permission management
   * @param {*} workspaceId
   * @returns
   */
  static async getAllWorkspacePermissions(workspaceId) {
    try {
      const permissions = await PermissionModel.findMany({
        where: {
          scope: "SYSTEM",
          workspaceId,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });

      return permissions;
    } catch (error) {
      Logger.error(error.message, `Get all workspace permissions failed`);
    }
  }
}
