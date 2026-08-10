"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ActiveSectionProvider } from "./ActiveSectionContext";
import Footer from "./Footer";
import HomeSection from "./sections/HomeSection";
import ProjectManageSection from "./sections/ProjectManageSection";
import SettingsSection from "./sections/SettingsSection";
import UserManageSection from "./sections/UserManageSection";

export default function MainSidebar() {
  return (
    <ActiveSectionProvider>
      <Sidebar variant="floating" collapsible="offcanvas">
        <SidebarContent className="px-4 pt-12 flex-1">
          <HomeSection sectionId="home" />
          {/* <WorkspaceSection sectionId="workspace" /> */}
          <ProjectManageSection sectionId="projects" />
          <UserManageSection sectionId="user" />
          <SettingsSection sectionId="settings" />
          <Footer />
        </SidebarContent>
      </Sidebar>
    </ActiveSectionProvider>
  );
}
