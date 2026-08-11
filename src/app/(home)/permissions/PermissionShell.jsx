"use client";

import dynamic from "next/dynamic";
import { Suspense, use, useState } from "react";
import DialogLoading from "@/components/loading/DialogLoading";
import TableLoading from "@/components/loading/TableLoading";
import NoPermissionUI from "./components/NoPermissionUI";

const PermissionCreateDrawerLazy = dynamic(() => import("./components/PermissionCreateDialog"), {
  ssr: false,
  loading: () => <DialogLoading />,
});

const PermissionListingsLazy = dynamic(() => import("./components/PermissionListings"), {
  loading: () => <TableLoading withTable={true} />,
});

export default function PermissionShell({ hasPermissionPromise, projectsPromise }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasPermission = use(hasPermissionPromise);
  const [startFetchPermissions, setStartFetchPermissions] = useState(hasPermission ? true : false);

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
