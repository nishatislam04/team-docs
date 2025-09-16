"use client";

import DrawerLoading from "@/components/loading/DrawerLoading";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import dynamic from "next/dynamic";
import { use, useState } from "react";
import NoProjectUI from "./components/NoProjectUI";
import { useProjectDrawerStore } from "./store/useProjectDrawerStore";

const ProjectCreateDrawerLazy = dynamic(() => import("./components/ProjectCreateDrawer"), {
  ssr: false,
  loading: () => <DrawerLoading />,
});

const ProjectListingsLazy = dynamic(() => import("./components/ProjectListings"), {
  loading: () => <LazyPageLoading>Loading Projects...</LazyPageLoading>,
});

export default function ProjectShell({ hasProjectsPromise, projectPromise }) {
  const hasProjects = use(hasProjectsPromise);
  const projects = projectPromise ? use(projectPromise) : null;
  const [startFetchProjects, setStartFetchProjects] = useState(
    projects ? false : hasProjects ? true : false
  );
  const { isDrawerOpen } = useProjectDrawerStore();

  return (
    <>
      {isDrawerOpen && <ProjectCreateDrawerLazy setStartFetchProjects={setStartFetchProjects} />}

      {hasProjects ? (
        <ProjectListingsLazy
          projects={projects}
          hasProjects={hasProjects}
          setStartFetchProjects={setStartFetchProjects}
        />
      ) : (
        <NoProjectUI />
      )}
    </>
  );
}
