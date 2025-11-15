import { Suspense } from "react";
import { getSession } from "./_components/actions/getSession";
import { getWorkspaceFn } from "./_components/actions/getWorkspace";
import Footer from "./_components/Footer";
import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";
import FeaturedSectionWrapper from "./_components/sub/FeaturedSectionWrapper";

export default async function LandingPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen">Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}

async function LandingPageContent() {
  const workspace = getWorkspaceFn();
  const sessionPromise = getSession();

  return (
    <main className="bg-background min-h-screen">
      <Header sessionPromise={sessionPromise} />

      <HeroSection workspace={workspace} />
      <FeaturedSectionWrapper workspace={workspace} />
      <Footer />
    </main>
  );
}
