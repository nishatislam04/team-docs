import { Suspense } from "react";
import { canPermissionViewAuth } from "@/authorization/PermissionAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import { getAllProjectsFn } from "./actions/getAllProjects";
import { getHasPermissions } from "./actions/getHasPermissions";
import PermissionShell from "./PermissionShell";

export default async function PermissionsPage() {
  await requireWorkspaceActive();
  const canReadPermission = await canPermissionViewAuth();
  const hasPermissionResources = getHasPermissions();
  const projectsPromise = getAllProjectsFn();

  return (
    <Suspense fallback={<LazyPageLoading>Loading Permissions...</LazyPageLoading>}>
      <PermissionShell
        hasPermissionPromise={hasPermissionResources}
        canReadPermission={canReadPermission}
        projectsPromise={projectsPromise}
      />
    </Suspense>
  );
}
