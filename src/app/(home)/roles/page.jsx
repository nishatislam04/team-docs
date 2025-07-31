import RoleShell from "./RoleShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { canViewRolesAuth } from "@/authorization/RoleAuthGuard";

export default async function RolePage() {
  await requireWorkspaceActive();

  const canViewRoles = await canViewRolesAuth();

  return <RoleShell canViewRoles={canViewRoles} hasRoles={true} />;
}
