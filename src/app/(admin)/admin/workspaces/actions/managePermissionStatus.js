"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";

export async function managePermissionStatus(id, status) {
  if (status === "ACTIVE") {
    const response = await PermissionServices.updatePermissionStatus(id, status);
    return response;
  } else {
    const response = await PermissionServices.updatePermissionStatus(id, status);
    return response;
  }
}
