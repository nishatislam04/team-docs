import { Settings, UserPen } from "lucide-react";
import Link from "next/link";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";
import { SidebarMenuButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useActiveSection } from "../ActiveSectionContext";
import BaseSection from "./BaseSection";

export default function SettingsSection({ sectionId }) {
  const { isActive, setActive } = useActiveSection();
  return (
    <BaseSection title="Settings" icon={Settings} sectionId={sectionId}>
      <SidebarMenuSubItem>
        <ComingSoonWrapper enabled className="w-full">
          <SidebarMenuButton
            asChild
            className={isActive(sectionId, "profile") ? "bg-muted font-semibold" : ""}
            onClick={() => setActive(sectionId, "profile")}
          >
            <Link href="/settings/profile">
              <UserPen className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </SidebarMenuButton>
        </ComingSoonWrapper>
      </SidebarMenuSubItem>
    </BaseSection>
  );
}
