import { canViewRolesAuth } from "@/authorization/RoleAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import RoleShell from "./RoleShell";

export default async function RolePage() {
  await requireWorkspaceActive();

  const canViewRoles = await canViewRolesAuth();

  return <RoleShell canViewRoles={canViewRoles} hasRoles={true} />;
}
