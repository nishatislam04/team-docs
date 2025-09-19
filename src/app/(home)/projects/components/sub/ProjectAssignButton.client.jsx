"use client";

import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectAssignButton({ project }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex cursor-pointer items-center gap-1 bg-green-100"
      onClick={() => {
        router.push(`/projects/${project.slug}/assign-dev`);
      }}
    >
      <UsersRound className="h-4 w-4" /> Assign Dev
    </Button>
  );
}
