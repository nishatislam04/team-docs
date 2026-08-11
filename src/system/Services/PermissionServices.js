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

  /**
   * batch update permission statuses for a workspace
   * scoped to SYSTEM permissions of the given workspace only
   * @param {*} workspaceId
   * @param {*} ids
   * @param {*} status
   * @returns
   */
  static async updatePermissionStatusBatch(workspaceId, ids, status) {
    try {
      const result = await PermissionModel.updateMany({
        where: {
          id: { in: ids },
          workspaceId,
          scope: "SYSTEM",
        },
        data: { status },
      });

      return {
        success: true,
        type: "success",
        message: "Action Successful",
        count: result.count,
      };
    } catch (error) {
      Logger.error(error.message, `Permission batch update fail`);
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
          scope: "WORKSPACE",
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
          description: true,
          action: true,
          resource: true,
          status: true,
        },
      });

      Logger.info({ permissions }, `Get all workspace permissions success`);

      return permissions;
    } catch (error) {
      Logger.error(error.message, `Get all workspace permissions failed`);
    }
  }
}
