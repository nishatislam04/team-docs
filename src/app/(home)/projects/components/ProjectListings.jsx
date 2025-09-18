import { Suspense } from "react";
import ProjectsArea from "./ProjectsArea";
import ProjectCreateButton from "./sub/ProjectCreateButton";
import ProjectDrawerLoader from "./sub/ProjectDrawerLoader";

export default function ProjectListings({ hasProjectsPromise, projectsPromise }) {
  return (
    <section className="space-y-8">
      <ProjectDrawerLoader />

      <section className="flex max-h-14 w-full items-start justify-between border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
        <div className="ml-auto">
          <ProjectCreateButton />
        </div>
      </section>

      <Suspense fallback={null}>
        <ProjectsArea hasProjectsPromise={hasProjectsPromise} projectsPromise={projectsPromise} />
      </Suspense>
    </section>
  );
}
