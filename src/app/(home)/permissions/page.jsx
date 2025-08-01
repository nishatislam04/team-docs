import { PermissionServices } from "@/system/Services/PermissionServices";
import PermissionShell from "./PermissionShell";
import { Session } from "@/lib/Session";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { canPermissionViewAuth } from "@/authorization/PermissionAuthGuard";

export default async function PermissionsPage() {
  const session = await Session.getCurrentUser();
  await requireWorkspaceActive();

  const canReadPermission = await canPermissionViewAuth();

  const hasPermissionResource = await PermissionServices.hasResource({
    where: { ownerId: session.id },
  });

  return (
    <PermissionShell hasPermission={hasPermissionResource} canReadPermission={canReadPermission} />
  );
}
