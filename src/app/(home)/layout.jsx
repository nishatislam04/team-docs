import ConditionalHomeLayout from "@/components/layout/ConditionalHomeLayout";
import RouteChangeHandler from "@/components/layout/RouteChangeHandler";
import { Session } from "@/lib/Session";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function HomeLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Fetch workspace data for the header
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspace = workspaceId
    ? await WorkspaceServices.getResource({ where: { id: workspaceId } })
    : null;

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <RouteChangeHandler />
        <ConditionalHomeLayout defaultOpen={defaultOpen} workspace={workspace}>
          {children}
        </ConditionalHomeLayout>
      </ThemeProvider>
    </SessionProvider>
  );
}
