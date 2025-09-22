import ConditionalHomeLayout from "@/components/layout/ConditionalHomeLayout";
import RouteChangeHandler from "@/components/layout/RouteChangeHandler";
import { Session } from "@/lib/Session";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";

export const dynamic = "force-dynamic";

export default async function HomeLayout({ children }) {
  // Fetch workspace data for the header
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspace = workspaceId
    ? await WorkspaceServices.getResource({ where: { id: workspaceId } })
    : null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouteChangeHandler />
      <ConditionalHomeLayout workspace={workspace}>{children}</ConditionalHomeLayout>
    </ThemeProvider>
  );
}
