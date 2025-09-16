"use client";

import DrawerLoading from "@/components/loading/DrawerLoading";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import dynamic from "next/dynamic";
import { use, useState } from "react";
import NoProjectUI from "./components/NoProjectUI";

const ProjectCreateDrawerLazy = dynamic(() => import("./components/ProjectCreateDrawer"), {
  ssr: false,
  loading: () => <DrawerLoading />,
});

const ProjectListingsLazy = dynamic(() => import("./components/ProjectListings"), {
  loading: () => <LazyPageLoading>Loading Projects...</LazyPageLoading>,
});

export default function ProjectShell({ hasProjectsPromise }) {
  const hasProjects = use(hasProjectsPromise);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [startFetchProjects, setStartFetchProjects] = useState(hasProjects ? true : false);

  return (
    <>
      {isDrawerOpen && (
        <ProjectCreateDrawerLazy
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          setStartFetchProjects={setStartFetchProjects}
        />
      )}

      {hasProjects ? (
        <ProjectListingsLazy
          hasProjects={hasProjects}
          setIsDrawerOpen={setIsDrawerOpen}
          startFetchProjects={startFetchProjects}
          setStartFetchProjects={setStartFetchProjects}
        />
      ) : (
        <NoProjectUI setIsDrawerOpen={setIsDrawerOpen} />
      )}
    </>
  );
}
