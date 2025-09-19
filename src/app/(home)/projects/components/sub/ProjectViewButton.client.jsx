"use client";

import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectViewButton({ project }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex cursor-pointer items-center gap-1"
      onClick={() => {
        router.push(`/projects/${project.slug}/editor`);
        router.refresh();
      }}
    >
      <LayoutTemplate className="h-4 w-4" /> View
    </Button>
  );
}
