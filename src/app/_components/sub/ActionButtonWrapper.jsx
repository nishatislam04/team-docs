"use client";

import dynamic from "next/dynamic";
import LandingLoading from "@/components/loading/LandingLoading";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { devDelay } from "@/lib/devDelay";

const ActionButton = dynamic(
  () =>
    import("../ActionButton").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <LandingLoading size="md" className="h-24 min-w-30" />,
  },
);

export default function ActionButtonWrapper({ workspace }) {
  const userSession = useCurrentSession();
  const isAuthenticated = !!userSession;
  return <ActionButton isAuthenticated={isAuthenticated} workspace={workspace} />;
}
