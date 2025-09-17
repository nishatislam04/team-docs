"use client";

import CreateButtonShared from "@/components/shared/CreateButtonShared";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useProjectDrawerStore } from "../store/useProjectDrawerStore";
import ProjectsArea from "./ProjectsArea";

const ProjectCreateDrawerLazy = dynamic(() => import("./ProjectCreateDrawer"), {
  ssr: false,
});

const ProjectEditDrawerLazy = dynamic(() => import("./ProjectEditDrawer"), {
  ssr: false,
});

export default function ProjectListings({ hasProjectsPromise, projectsPromise }) {
  return (
    <section className="space-y-8">
      <ProjectCreateDrawerLazy />
      <ProjectEditDrawerLazy />

      <section className="flex max-h-14 w-full items-start justify-between border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
        <div className="ml-auto">
          <CreateButtonShared
            onClick={() => {
              useProjectDrawerStore.getState().setIsCreateDrawerOpen(true);
            }}
          >
            Create project
          </CreateButtonShared>
        </div>
      </section>

      <Suspense fallback={null}>
        <ProjectsArea hasProjectsPromise={hasProjectsPromise} projectsPromise={projectsPromise} />
      </Suspense>
    </section>
  );
}
