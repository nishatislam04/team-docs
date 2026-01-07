"use server";

import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getHasPermissions() {
  const session = await Session.getCurrentUser();
  // here we are looking for workspace level permissions
  const hasPermissionResource = await PermissionServices.hasResource({
    where: { ownerId: session.id, scope: "WORKSPACE" },
  });

  return hasPermissionResource;
}
