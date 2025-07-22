import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import WorkspaceShell from "./WorkspaceShell";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

export default async function WorkspacePage() {
  await requireWorkspaceActive();
  const user = await Session.getCurrentUser();

  const hasWorkspace = await WorkspaceService.hasResource({
    where: { ownerId: user.id },
  });

  return <WorkspaceShell hasWorkspace={hasWorkspace} />;
}
