"use client";

import dynamic from "next/dynamic";
import LandingLoading from "@/components/loading/LandingLoading";
import { devDelay } from "@/lib/devDelay";

const FeaturedSection = dynamic(
  () =>
    import("../FeaturedSection").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <LandingLoading size="lg" className="py-24" />,
  },
);

export default function FeaturedSectionWrapper({ workspace }) {
  return <FeaturedSection workspace={workspace} />;
}
