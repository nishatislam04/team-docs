"use client";

import dynamic from "next/dynamic";

const ProjectCreateDrawerLazy = dynamic(() => import("../ProjectCreateDrawer"), {
  ssr: false,
});

const ProjectEditDrawerLazy = dynamic(() => import("../ProjectEditDrawer"), {
  ssr: false,
});

export default function ProjectDrawersLoader() {
  return (
    <>
      <ProjectCreateDrawerLazy />
      <ProjectEditDrawerLazy />
    </>
  );
}
