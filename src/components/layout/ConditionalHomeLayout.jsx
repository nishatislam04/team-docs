"use client";

import ConditionalMainHeader from "@/components/layout/ConditionalMainHeader";
import MainSidebar from "@/components/layout/mainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

/**
 * Client-side conditional layout wrapper that handles layout switching
 * based on the current route. This fixes browser back button issues
 * by ensuring layout conditions are re-evaluated on client-side navigation.
 */
export default function ConditionalHomeLayout({ children, workspace }) {
  const pathname = usePathname();

  // Check if current page is an editor page
  const isEditorPage = pathname?.includes("/projects/") && pathname?.includes("/editor");

  // For editor pages, return children without the home layout
  if (isEditorPage) {
    return children;
  }

  // For non-editor pages, render the full home layout
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <MainSidebar />
        <div className="flex flex-1 flex-col overflow-hidden pl-3 md:pl-6">
          <ConditionalMainHeader workspace={workspace} />
          <main className="min-h-[80vh] flex-1 overflow-auto p-2 pl-0 md:p-4 md:pl-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
