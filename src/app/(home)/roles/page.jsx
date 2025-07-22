import RoleShell from "./RoleShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export default async function RolePage() {
  await requireWorkspaceActive();
  return <RoleShell hasRoles={true} />;
}
