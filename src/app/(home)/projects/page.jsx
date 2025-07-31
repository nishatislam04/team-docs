import { Session } from "@/lib/Session";
import { ProjectServices } from "@/system/Services/ProjectServices";
import ProjectShell from "./ProjectShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { canViewProjectsAuth } from "@/authorization/ProjectAuthGuard";

export default async function ProjectPage() {
  await requireWorkspaceActive();
  const projectAuthorization = await canViewProjectsAuth();
  const workspaceId = await Session.getWorkspaceIdForUser();

  const hasProjects = await ProjectServices.hasResource({
    where: { workspaceId },
  });

  return <ProjectShell projectAuthorization={projectAuthorization} hasProjects={hasProjects} />;
}
