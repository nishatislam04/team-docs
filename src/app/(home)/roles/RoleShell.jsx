"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DialogLoading from "@/components/loading/DialogLoading";
import LazyPageLoading from "@/components/loading/LazyPageLoading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RoleCreateDialogLazy = dynamic(
  () => import("@/app/(home)/roles/components/RoleCreateDialog"),
  {
    ssr: false,
    loading: () => <DialogLoading />,
  }
);

const RoleListingsLazy = dynamic(() => import("@/app/(home)/roles/components/RoleListings"), {
  loading: () => <LazyPageLoading>Loading Roles...</LazyPageLoading>,
});

export default function RoleShell({ hasRoles, canViewRoles }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shouldStartFetchRoles, setShouldStartFetchRoles] = useState(hasRoles ? true : false);

  if (canViewRoles.success === false) {
    toast.error(canViewRoles.errors._form[0]);
    router.replace("/");
  }

  return (
    <>
      {isDialogOpen && (
        <RoleCreateDialogLazy
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          setShouldStartFetchRoles={setShouldStartFetchRoles}
        />
      )}

      <RoleListingsLazy
        hasRoles={hasRoles}
        setIsDialogOpen={setIsDialogOpen}
        shouldStartFetchRoles={shouldStartFetchRoles}
        setShouldStartFetchRoles={setShouldStartFetchRoles}
      />
    </>
  );
}
