"use client";

import dynamic from "next/dynamic";
import { ActionButtonSkeleton } from "@/components/loading/landing/LandingSkeletons";
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
    loading: () => <ActionButtonSkeleton className="h-14 min-w-45" />,
  },
);

export default function ActionButtonWrapper({ workspace }) {
  const userSession = useCurrentSession();
  const isAuthenticated = !!userSession;
  return <ActionButton isAuthenticated={isAuthenticated} workspace={workspace} />;
}
