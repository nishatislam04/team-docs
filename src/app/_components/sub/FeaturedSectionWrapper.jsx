"use client";

import dynamic from "next/dynamic";
import { FeaturedSectionSkeleton } from "@/components/loading/landing/LandingSkeletons";
import { devDelay } from "@/lib/devDelay";

const FeaturedSection = dynamic(
  () =>
    import("../FeaturedSection").then(async (mod) => {
      await devDelay();
      return mod;
    }),
  {
    ssr: false,
    loading: () => <FeaturedSectionSkeleton />,
  },
);

export default function FeaturedSectionWrapper({ workspace }) {
  return <FeaturedSection workspace={workspace} />;
}
