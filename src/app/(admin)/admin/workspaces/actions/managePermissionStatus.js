"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";

export async function managePermissionStatus(id, status) {
  const response = await PermissionServices.updatePermissionStatus(id, status);
  return response;
}

export async function managePermissionStatusBatch(workspaceId, ids, status) {
  if (!workspaceId || !Array.isArray(ids) || ids.length === 0) {
    return {
      success: false,
      type: "fail",
      errors: { _form: ["No permissions selected to update"] },
    };
  }

  const response = await PermissionServices.updatePermissionStatusBatch(workspaceId, ids, status);
  return response;
}
