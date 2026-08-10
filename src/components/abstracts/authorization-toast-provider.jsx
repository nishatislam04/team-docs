"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

export function AuthorizationToastProvider() {
  const params = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const message = params.get("unauthorized");
    if (!message) return;

    if (message === "1") {
      toast.warning("You are not permitted to perform this action.");
    } else {
      toast.warning(decodeURIComponent(message));
    }
  }, [params, toast]);

  return null;
}
