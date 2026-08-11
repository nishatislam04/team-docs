"use client";

import dynamic from "next/dynamic";
import { HeaderProfileSkeleton } from "@/components/loading/landing/LandingSkeletons";
import { devDelay } from "@/lib/devDelay";

const ProfileMenuLazy = dynamic(
  () =>
    import("./ProfileMenu").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <HeaderProfileSkeleton />,
  },
);

export default function ProfileMenuWrapper({ sessionPromise }) {
  return <ProfileMenuLazy sessionPromise={sessionPromise} />;
}
