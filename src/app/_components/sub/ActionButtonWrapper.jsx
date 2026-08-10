"use client";

import dynamic from "next/dynamic";
import { useCurrentSession } from "@/hooks/useCurrentSession";

const ActionButton = dynamic(() => import("../ActionButton"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function ActionButtonWrapper({ workspace }) {
  const userSession = useCurrentSession();
  const isAuthenticated = !!userSession;
  return <ActionButton isAuthenticated={isAuthenticated} workspace={workspace} />;
}
