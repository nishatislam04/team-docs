import { forbidden } from "next/navigation";
import { canViewProjectsAuth } from "@/authorization/ProjectAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

import { getAllProjectsFn } from "./actions/getAllProjects";
import { getHasProjects } from "./actions/getHasProjects";
import ProjectListings from "./components/ProjectListings";

export default async function ProjectPage({ searchParams }) {
  await requireWorkspaceActive();

  const canViewProjects = await canViewProjectsAuth();
  if (canViewProjects.success === false) forbidden();

  const params = await searchParams;
  const hasProjectsPromise = getHasProjects();
  const projectPromise = getAllProjectsFn({
    page: Number(params.page) || 1,
    pageSize: Number(params.pageSize) || 10,
    sortBy: params.sortBy || "name",
    sortOrder: params.sortOrder || "asc",
  });

  return (
    <ProjectListings projectsPromise={projectPromise} hasProjectsPromise={hasProjectsPromise} />
  );
}
