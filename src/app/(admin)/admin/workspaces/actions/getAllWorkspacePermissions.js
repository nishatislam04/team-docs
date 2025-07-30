"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getAllWorkspacePermissions(workspaceId) {
  const permissions = await PermissionServices.getAllWorkspacePermissions(workspaceId);
  return permissions;
}
