import { FolderKanban, FolderOpenDot } from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useActiveSection } from "../ActiveSectionContext";
import BaseSection from "./BaseSection";

export default function ProjectManageSection({ sectionId }) {
  const { isActive, setActive } = useActiveSection();
  return (
    <BaseSection title="Project Manage" icon={FolderKanban} sectionId={sectionId}>
      <SidebarMenuSubItem>
        <SidebarMenuButton
          asChild
          className={cn(isActive(sectionId) ? "bg-muted font-semibold" : "")}
          onClick={() => setActive(sectionId)}
        >
          <Link href="/projects">
            <FolderOpenDot className="w-4 h-4" />
            <span>Projects</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    </BaseSection>
  );
}
