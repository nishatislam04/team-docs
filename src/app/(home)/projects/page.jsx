import { canViewProjectsAuth } from "@/authorization/ProjectAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import { Suspense } from "react";
import { getAllProjectsFn } from "./actions/getAllProjects";
import { getHasProjects } from "./actions/getHasProjects";
import ProjectListings from "./components/ProjectListings";

export default async function ProjectPage({ searchParams }) {
  await Promise.all([requireWorkspaceActive(), canViewProjectsAuth()]);

  const params = await searchParams;
  const hasProjectsPromise = getHasProjects();
  const projectPromise = getAllProjectsFn({
    page: Number(params.page) || 1,
    pageSize: Number(params.pageSize) || 10,
    sortBy: params.sortBy || "name",
    sortOrder: params.sortOrder || "asc",
  });

  return (
    <Suspense fallback={<LazyPageLoading>Resolving Page...</LazyPageLoading>}>
      <ProjectListings projectsPromise={projectPromise} hasProjectsPromise={hasProjectsPromise} />
    </Suspense>
  );
}
