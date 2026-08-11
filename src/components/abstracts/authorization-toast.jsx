"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

export function AuthorizationToast() {
  const toast = useToast();

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("unauthorized");
    if (!message) return;

    if (message === "1") {
      toast.warning("You are not permitted to perform this action.");
    } else {
      toast.warning(decodeURIComponent(message));
    }
  }, [toast]);

  return null;
}
