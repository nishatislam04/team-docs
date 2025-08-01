import Logger from "@/lib/Logger";
import { RolePermissionAssignDTO } from "../DTOs/RolePermissionAssignDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { RolePermissionAssignModel } from "../Models/RolePermissionAssignModel";
import { BaseService } from "./BaseService";

export class RolePermissionAssignServices extends BaseService {
  static modelName = "rolePermissionAssign";
  static dto = RolePermissionAssignDTO;

  static async performPermissionAssignment({ roleId, permissions, ownerId, workspaceId }) {
    try {
      const allPermissions = await PermissionModel.findMany({
        where: {
          AND: [{ scope: "WORKSPACE" }, { ownerId: ownerId }, { workspaceId: workspaceId }],
        },
        select: { id: true },
      });

      // 2. get selected permissions
      const selectedPermissions = allPermissions.filter((permission) =>
        permissions.some((p) => p === permission.id)
      );

      // 3. get non-selected permissions
      const nonSelectedPermissions = allPermissions.filter(
        (permission) => !permissions.some((p) => p === permission.id)
      );

      // 4. remove non-selected permissions
      await RolePermissionAssignModel.deleteMany({
        where: {
          permissionId: {
            in: nonSelectedPermissions.map((permission) => permission.id),
          },
        },
      });

      // 5. add selected permissions
      await Promise.all(
        selectedPermissions.map((permission) =>
          RolePermissionAssignModel.upsert({
            where: {
              roleId_permissionId: {
                roleId,
                permissionId: permission.id,
              },
            },
            create: {
              roleId,
              permissionId: permission.id,
              ownerId,
              // workspaceId, // we will update db to support this column
            },
            update: {
              ownerId,
              // workspaceId, // we will update db to support this column
            },
          })
        )
      );
    } catch (error) {
      Logger.error(error.message, `Perform permission assignment failed`);
      throw error;
    }
  }

  static async getAllPermissions(whereClause) {
    try {
      const permissions = await PermissionModel.findMany({
        where: { whereClause },
      });
      return RolePermissionAssignDTO.toCollection(permissions);
    } catch (error) {
      Logger.error(error.message, `Get all permissions failed`);
    }
  }

  static async getSelectedPermissionsForRole({ roleId, ownerId }) {
    try {
      return RolePermissionAssignModel.findMany({
        where: { roleId, ownerId },
        select: { permissionId: true },
      });
    } catch (error) {
      Logger.error(error.message, `Get selected permissions for role failed`);
    }
  }
}
