import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";
import ProjectShell from "./ProjectShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export default async function ProjectPage() {
  await requireWorkspaceActive();
  const workspaceId = await Session.getWorkspaceIdForUser();

  const hasProjects = await ProjectService.hasResource({
    where: { workspaceId },
  });

  return <ProjectShell hasProjects={hasProjects} />;
}
