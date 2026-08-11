import { Suspense } from "react";
import ConditionalHomeLayout from "@/components/layout/ConditionalHomeLayout";
import RouteChangeHandler from "@/components/layout/RouteChangeHandler";
import { Session } from "@/lib/Session";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";

export default async function HomeLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <RouteChangeHandler />
      </Suspense>
      <Suspense fallback={<div>Loading workspace...</div>}>
        <HomeLayoutContent>{children}</HomeLayoutContent>
      </Suspense>
    </>
  );
}

async function HomeLayoutContent({ children }) {
  // Fetch workspace data for the header
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspace = workspaceId
    ? await WorkspaceServices.getResource({ where: { id: workspaceId } })
    : null;

  return <ConditionalHomeLayout workspace={workspace}>{children}</ConditionalHomeLayout>;
}
