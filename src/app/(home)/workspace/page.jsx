import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { Session } from "@/lib/Session";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";
import WorkspaceShell from "./WorkspaceShell";

export default async function WorkspacePage() {
  await requireWorkspaceActive();
  const user = await Session.getCurrentUser();

  const hasWorkspace = await WorkspaceServices.hasResource({
    where: { ownerId: user.id },
  });

  return <WorkspaceShell hasWorkspace={hasWorkspace} />;
}
