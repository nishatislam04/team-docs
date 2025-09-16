import { canViewProjectsAuth } from "@/authorization/ProjectAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { getHasProjects } from "./actions/getHasProjects";
import ProjectShell from "./ProjectShell";

export default async function ProjectPage() {
  await requireWorkspaceActive();
  await canViewProjectsAuth();
  const hasProjectsPromise = getHasProjects();

  return (
    // <Suspense fallback={<LazyPageLoading>Loading Projects...</LazyPageLoading>}>
    //   </Suspense>
    <ProjectShell hasProjectsPromise={hasProjectsPromise} />
  );
}
