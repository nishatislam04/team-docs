"use client";

import dynamic from "next/dynamic";

const FeaturedSection = dynamic(() => import("../FeaturedSection"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function FeaturedSectionWrapper({ workspace }) {
  return <FeaturedSection workspace={workspace} />;
}
