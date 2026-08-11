"use client";

import dynamic from "next/dynamic";
import LandingLoading from "@/components/loading/LandingLoading";
import { devDelay } from "@/lib/devDelay";

const ProfileMenuLazy = dynamic(
  () =>
    import("./ProfileMenu").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <LandingLoading size="sm" className="min-w-[120px]" />,
  },
);

export default function ProfileMenuWrapper({ sessionPromise }) {
  return <ProfileMenuLazy sessionPromise={sessionPromise} />;
}
