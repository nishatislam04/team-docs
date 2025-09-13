"use client";
import { Button } from "@/components/ui/button";
import { useActionButton } from "./hooks/useActionButton";
import RegistrationDialog from "./registration/RegistrationDialog";
import useRegistrationStore from "./store/useRegistrationStore";
// import RegistrationDialog from "./registration";

// Dynamically import the registration dialog
// const RegistrationDialog = dynamic(() => import("./registration"), {
//   // ssr: false,
//   loading: <DialogLoading />,
// });

export default function ActionButton({ isAuthenticated, workspace }) {
  const { openFormDialog, registrationSuccess, registrationData, resetRegistrationState } =
    useRegistrationStore();

  const { buttonText, buttonIcon, isDisabled, handleButtonClick } = useActionButton({
    registrationSuccess,
    registrationData,
    isAuthenticated,
    workspace,
    resetRegistrationState,
    openFormDialog,
  });

  return (
    <>
      <Button
        size="lg"
        onClick={handleButtonClick}
        disabled={isDisabled}
        className="flex items-center justify-center"
      >
        {buttonText}
        {buttonIcon}
      </Button>

      {/* Render the registration dialog */}
      <RegistrationDialog isAuthenticated={isAuthenticated} />
    </>
  );
}
