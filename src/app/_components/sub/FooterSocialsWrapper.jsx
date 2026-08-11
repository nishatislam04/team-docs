"use client";

import dynamic from "next/dynamic";
import { FooterSocialsSkeleton } from "@/components/loading/landing/LandingSkeletons";
import { devDelay } from "@/lib/devDelay";

const FooterSocials = dynamic(
  () =>
    import("./FooterSocials").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <FooterSocialsSkeleton />,
  },
);

export default function FooterSocialsWrapper() {
  return <FooterSocials />;
}
