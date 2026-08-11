import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeaderProfileSkeleton } from "@/components/loading/landing/LandingSkeletons";

import ProfileMenuWrapper from "./sub/ProfileMenuWrapper";

/**
 * Header component that displays navigation and auth state
 * @param {Object} props - Component props
 * @param {Object|null} props.session - User session object or null if not authenticated
 */
export default function Header({ sessionPromise }) {
  return (
    <header className="container mx-auto flex items-center justify-between px-3 py-6 sm:px-4">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Team Docs Logo" width={36} height={36} className="mr-2" />
        <span className="text-xl font-bold">Team Docs</span>
      </Link>

      <Suspense fallback={<HeaderProfileSkeleton />}>
        <ProfileMenuWrapper sessionPromise={sessionPromise} />
      </Suspense>
    </header>
  );
}
