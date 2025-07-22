import { PermissionServices } from "@/system/Services/PermissionServices";
import PermissionShell from "./PermissionShell";
import { Session } from "@/lib/Session";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export default async function PermissionsPage() {
  const session = await Session.getCurrentUser();
  await requireWorkspaceActive();

  const hasPermission = await PermissionServices.hasResource({
    where: { ownerId: session.id },
  });

  return <PermissionShell hasPermission={hasPermission} />;
}
