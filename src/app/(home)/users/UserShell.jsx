"use client";

import { useState } from "react";
import UserLisitngs from "./components/UserListing";
import dynamic from "next/dynamic";
import DialogLoading from "@/components/loading/DialogLoading";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserCreateDialogLazy = dynamic(() => import("./components/UserCreateDialog"), {
  ssr: false,
  loading: () => <DialogLoading />,
});

export default function UserShell({ userAuthorization }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  if (!userAuthorization.success) {
    toast.error(userAuthorization.errors._form[0]);
    router.replace("/");
  }

  return (
    <>
      {isDialogOpen && (
        <UserCreateDialogLazy
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onSuccess={() => setShouldRefetch(true)}
        />
      )}

      <UserLisitngs
        setIsDialogOpen={setIsDialogOpen}
        shouldRefetch={shouldRefetch}
        setShouldRefetch={setShouldRefetch}
      />
    </>
  );
}
