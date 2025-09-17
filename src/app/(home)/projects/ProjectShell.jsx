"use client";

import DrawerLoading from "@/components/loading/DrawerLoading";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import dynamic from "next/dynamic";
import { use } from "react";
import NoProjectUI from "./components/NoProjectUI";

const ProjectCreateDrawerLazy = dynamic(() => import("./components/ProjectCreateDrawer"), {
  // ssr: false,
  loading: () => <DrawerLoading />,
});

const ProjectEditDrawerLazy = dynamic(() => import("./components/ProjectEditDrawer"), {
  ssr: false,
  loading: () => <DrawerLoading />,
});

const ProjectListingsLazy = dynamic(() => import("./components/ProjectListings"), {
  ssr: false,
  loading: () => <LazyPageLoading>Loading Project Listings...</LazyPageLoading>,
});

export default function ProjectShell({ hasProjectsPromise, projectPromise }) {
  const hasProjects = use(hasProjectsPromise);
  const projects = projectPromise ? use(projectPromise) : null;

  return (
    <>
      <ProjectCreateDrawerLazy />
      <ProjectEditDrawerLazy />

      {hasProjects ? (
        <ProjectListingsLazy projects={projects} hasProjects={hasProjects} />
      ) : (
        <NoProjectUI />
      )}
    </>
  );
}
