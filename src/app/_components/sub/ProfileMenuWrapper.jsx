"use client";

import dynamic from "next/dynamic";

const ProfileMenuLazy = dynamic(() => import("./ProfileMenu"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function ProfileMenuWrapper({ sessionPromise }) {
  return <ProfileMenuLazy sessionPromise={sessionPromise} />;
}
