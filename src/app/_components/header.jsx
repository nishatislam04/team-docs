import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LandingLoading from "@/components/loading/LandingLoading";

import ProfileMenuWrapper from "./sub/ProfileMenuWrapper";

/**
 * Header component that displays navigation and auth state
 * @param {Object} props - Component props
 * @param {Object|null} props.session - User session object or null if not authenticated
 */
export default function Header({ sessionPromise }) {
  return (
    <header className="container mx-auto flex items-center justify-between px-4 py-6">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Team Docs Logo" width={36} height={36} className="mr-2" />
        <span className="text-xl font-bold">Team Docs</span>
      </Link>

      <Suspense fallback={<LandingLoading size="xl" className="min-w-30 h-24" />}>
        <ProfileMenuWrapper sessionPromise={sessionPromise} />
      </Suspense>
    </header>
  );
}
