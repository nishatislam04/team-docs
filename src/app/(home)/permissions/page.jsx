import PermissionShell from "./PermissionShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { canPermissionViewAuth } from "@/authorization/PermissionAuthGuard";
import { getHasPermissions } from "./actions/getHasPermissions";
import { getAllProjectsFn } from "./actions/getAllProjects";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import { Suspense } from "react";

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
