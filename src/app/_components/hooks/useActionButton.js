import { useEffect, useState } from "react";

import { ArrowRight, Clock, AlertCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function useActionButton({
  registrationSuccess,
  registrationData,
  isAuthenticated,
  session,
  workspaceId,
  workspaceStatus,
  resetRegistrationState,
  openFormDialog,
}) {
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Get Started for Free");
  const [buttonIcon, setButtonIcon] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // * manage the action button
  useEffect(() => {
    const checkUserStatus = async () => {
      // Handle immediate post-registration state
      if (registrationSuccess && registrationData) {
        if (isAuthenticated) {
          // Authenticated user created workspace - show processing state
          setButtonText("Request Processing...");
          setButtonIcon(<Clock className="ml-2 h-4 w-4 animate-spin" />);
          setIsDisabled(true);
        } else {
          // New user registration - show processing state
          setButtonText("Registration Processing...");
          setButtonIcon(<Clock className="ml-2 h-4 w-4 animate-spin" />);
          setIsDisabled(true);
        }
        return;
      }

      if (isAuthenticated) {
        if (session && session?.status !== "ACTIVE") {
          setButtonText("Account Inactive");
          setButtonIcon(<AlertCircle className="ml-2 h-4 w-4" />);
          setIsDisabled(true);
          return;
        }
        if (workspaceId) {
          if (session && session?.status === "ACTIVE" && workspaceStatus === "ACTIVE") {
            setButtonText("Visit your workspace");
            setButtonIcon(<ArrowRight className="ml-2 h-4 w-4" />);
            setIsDisabled(false);
          } else if (workspaceStatus === "PENDING") {
            setButtonText("Request Processing...");
            setButtonIcon(<Clock className="ml-2 h-4 w-4 animate-spin" />);
            setIsDisabled(true);
          } else if (workspaceStatus === "INACTIVE") {
            setButtonText("Workspace Inactive");
            setButtonIcon(<AlertCircle className="ml-2 h-4 w-4" />);
            setIsDisabled(true);
          }
        } else {
          setButtonText("Create your workspace");
          setButtonIcon(<Plus className="ml-2 h-4 w-4" />);
          setIsDisabled(false);
        }
      } else {
        setButtonText("Get Started for Free");
        setButtonIcon(<ArrowRight className="ml-2 h-4 w-4" />);
        setIsDisabled(false);
      }
    };

    checkUserStatus();
  }, [
    isAuthenticated,
    workspaceId,
    workspaceStatus,
    session,
    registrationSuccess,
    registrationData,
  ]);

  // * Reset registration state after server props are updated
  useEffect(() => {
    if (registrationSuccess && (workspaceId || session)) {
      // Server props have been updated, reset the registration state
      const timer = setTimeout(() => {
        resetRegistrationState();
      }, 1000); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, workspaceId, session, resetRegistrationState]);

  // * handle click
  const handleButtonClick = () => {
    // Don't allow clicks during registration processing
    if (registrationSuccess) {
      return;
    }

    if (
      isAuthenticated &&
      workspaceId &&
      workspaceStatus === "ACTIVE" &&
      session?.status === "ACTIVE"
    ) {
      // Redirect to workspace when button is clicked
      router.push(`/home`);
    } else {
      // Open registration dialog for other cases
      openFormDialog();
    }
  };

  return {
    buttonText,
    buttonIcon,
    isDisabled,
    handleButtonClick,
  };
}
