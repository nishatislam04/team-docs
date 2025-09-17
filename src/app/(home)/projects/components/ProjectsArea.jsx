"use client";

import LazyPageLoading from "@/components/loading/LazyPageLoading";
import { Suspense, use } from "react";
import NoProjectUI from "./NoProjectUI";
import ProjectTable from "./ProjectTable";

/**
 * ProjectsArea
 * - Consumes hasProjectsPromise to decide which branch to show
 * - If has projects, shows a Suspense-wrapped ProjectTable that resolves projectsPromise
 */
const ProjectsArea = ({ hasProjectsPromise, projectsPromise }) => {
  const hasProjects = use(hasProjectsPromise);

  if (!hasProjects) return <NoProjectUI />;

  return (
    <Suspense fallback={<LazyPageLoading>Loading project table...</LazyPageLoading>}>
      <ProjectTable projectsPromise={projectsPromise} />
    </Suspense>
  );
};

export default ProjectsArea;
