"use client";

import CreateButtonShared from "@/components/shared/CreateButtonShared";
import { useProjectDrawerStore } from "../../store/useProjectDrawerStore";

export default function ProjectCreateButton() {
  return (
    <CreateButtonShared
      onClick={() => useProjectDrawerStore.getState().setIsCreateDrawerOpen(true)}
    >
      Create project
    </CreateButtonShared>
  );
}
