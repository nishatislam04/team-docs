import { canViewProjectsAuth } from "@/authorization/ProjectAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { getAllProjectsFn } from "./actions/getAllProjects";
import { getHasProjects } from "./actions/getHasProjects";
import ProjectShell from "./ProjectShell";

export default async function ProjectPage() {
  await requireWorkspaceActive();
  await canViewProjectsAuth();
  const hasProjectsPromise = getHasProjects();
  const projectPromise = getAllProjectsFn();

  return <ProjectShell hasProjectsPromise={hasProjectsPromise} projectPromise={projectPromise} />;
}
