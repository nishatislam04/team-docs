"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useProjectDrawerStore } from "../../store/useProjectDrawerStore";
import { useSelectedProjectStore } from "../../store/useSelectedProjectStore";

export default function ProjectEditButton({ project }) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="flex cursor-pointer items-center gap-1 bg-yellow-100"
      onClick={() => {
        useProjectDrawerStore.getState().setIsEditDrawerOpen(true);
        useSelectedProjectStore.getState().setSelectedProject(project);
      }}
    >
      <Edit className="h-4 w-4" /> Edit
    </Button>
  );
}
