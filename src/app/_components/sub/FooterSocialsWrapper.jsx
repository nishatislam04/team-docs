"use client";

import dynamic from "next/dynamic";

const FooterSocials = dynamic(() => import("./FooterSocials"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function FooterSocialsWrapper() {
  return <FooterSocials />;
}
