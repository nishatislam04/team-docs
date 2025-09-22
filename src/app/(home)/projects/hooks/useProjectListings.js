"use client";

import { use, useEffect } from "react";
import { useProjectsStore } from "../store/useProjectsStore";

export function useProjectListings(projectsPromise) {
  const serverProjects = use(projectsPromise);

  const { setProjects } = useProjectsStore();
  const projects = useProjectsStore((s) => s.projects);

  useEffect(() => {
    if (serverProjects?.data) {
      setProjects(serverProjects.data);
    }
  }, [serverProjects, setProjects]);

  return { projects, serverProjects };
}
