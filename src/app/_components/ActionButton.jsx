"use client";
import { Button } from "@/components/ui/button";
import { useRegistrationStore } from "./store/useRegistrationStore";
import dynamic from "next/dynamic";
import DialogLoading from "@/components/loading/DialogLoading";
import { useActionButton } from "./hooks/useActionButton";
import RegistrationDialog from "./registration/RegistrationDialog";
// import RegistrationDialog from "./registration";

// Dynamically import the registration dialog
// const RegistrationDialog = dynamic(() => import("./registration"), {
//   // ssr: false,
//   loading: <DialogLoading />,
// });

export default function ActionButton({ session, isAuthenticated, workspaceId, workspaceStatus }) {
  const { openFormDialog, registrationSuccess, registrationData, resetRegistrationState } =
    useRegistrationStore();

  const { buttonText, buttonIcon, isDisabled, handleButtonClick } = useActionButton({
    registrationSuccess,
    registrationData,
    isAuthenticated,
    session,
    workspaceId,
    workspaceStatus,
    resetRegistrationState,
    openFormDialog,
  });

  return (
    <>
      <Button
        size="lg"
        onClick={handleButtonClick}
        disabled={isDisabled}
        className="flex items-center justify-center mx-auto"
      >
        {buttonText}
        {buttonIcon}
      </Button>

      {/* Render the registration dialog */}
      <RegistrationDialog isAuthenticated={isAuthenticated} />
    </>
  );
}
