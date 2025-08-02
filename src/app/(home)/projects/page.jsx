import ProjectShell from "./ProjectShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { canViewProjectsAuth } from "@/authorization/ProjectAuthGuard";
import { getHasProjects } from "./actions/getHasProjects";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import { Suspense } from "react";

export default async function ProjectPage() {
  await requireWorkspaceActive();
  const projectAuthorization = await canViewProjectsAuth();
  const hasProjectsPromise = getHasProjects();

  return (
    <Suspense fallback={<LazyPageLoading>Loading Projects...</LazyPageLoading>}>
      <ProjectShell
        projectAuthorization={projectAuthorization}
        hasProjectsPromise={hasProjectsPromise}
      />
    </Suspense>
  );
}
