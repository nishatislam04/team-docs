"use client";

import dynamic from "next/dynamic";
import LandingLoading from "@/components/loading/LandingLoading";
import { devDelay } from "@/lib/devDelay";

const FooterSocials = dynamic(
  () =>
    import("./FooterSocials").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <LandingLoading size="sm" className="mt-6 min-h-[40px] items-start" />,
  },
);

export default function FooterSocialsWrapper() {
  return <FooterSocials />;
}
