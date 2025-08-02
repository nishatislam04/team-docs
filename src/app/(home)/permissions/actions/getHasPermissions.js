"use server";

import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getHasPermissions() {
  const session = await Session.getCurrentUser();
  const hasPermissionResource = await PermissionServices.hasResource({
    where: { ownerId: session.id },
  });

  return hasPermissionResource;
}
