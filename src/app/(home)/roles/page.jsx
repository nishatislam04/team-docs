import { forbidden } from "next/navigation";
import { canViewRolesAuth } from "@/authorization/RoleAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import RoleShell from "./RoleShell";

export default async function RolePage() {
  await requireWorkspaceActive();

  const canViewRoles = await canViewRolesAuth();
  if (canViewRoles.success === false) forbidden();

  return <RoleShell hasRoles={true} />;
}
