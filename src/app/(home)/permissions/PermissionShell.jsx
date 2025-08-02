"use client";

import { Suspense, use, useState } from "react";
import dynamic from "next/dynamic";
import NoPermissionUI from "./components/NoPermissionUI";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DialogLoading from "@/components/loading/DialogLoading";
import TableLoading from "@/components/loading/TableLoading";

const PermissionCreateDrawerLazy = dynamic(() => import("./components/PermissionCreateDialog"), {
  ssr: false,
  loading: () => <DialogLoading />,
});

const PermissionListingsLazy = dynamic(() => import("./components/PermissionListings"), {
  loading: () => <TableLoading />,
});

export default function PermissionShell({
  hasPermissionPromise,
  canReadPermission,
  projectsPromise,
}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasPermission = use(hasPermissionPromise);
  const [startFetchPermissions, setStartFetchPermissions] = useState(hasPermission ? true : false);

  if (canReadPermission.success === false) {
    toast.error(canReadPermission.errors._form[0]);
    return router.replace("/");
  }

  return (
    <>
      {isDialogOpen && (
        <Suspense fallback={<DialogLoading />}>
          <PermissionCreateDrawerLazy
            projectsPromise={projectsPromise}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            setStartFetchPermissions={setStartFetchPermissions}
          />
        </Suspense>
      )}

      {hasPermission ? (
        <Suspense fallback={<TableLoading />}>
          <PermissionListingsLazy
            hasPermission={hasPermission}
            setIsDialogOpen={setIsDialogOpen}
            startFetchPermissions={startFetchPermissions}
            setStartFetchPermissions={setStartFetchPermissions}
            projectsPromise={projectsPromise}
          />
        </Suspense>
      ) : (
        <NoPermissionUI setIsDialogOpen={setIsDialogOpen} />
      )}
    </>
  );
}
