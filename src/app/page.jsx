import { Suspense } from "react";
import LandingLoading from "@/components/loading/LandingLoading";
import { getSession } from "./_components/actions/getSession";
import { getWorkspaceFn } from "./_components/actions/getWorkspace";
import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import Header from "./_components/header";
import FeaturedSectionWrapper from "./_components/sub/FeaturedSectionWrapper";
import WhyChooseUs from "./_components/WhyChooseUs";

export default async function LandingPage() {
  return (
    <Suspense fallback={<LandingLoading fullScreen size="xl" />}>
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

      <WhyChooseUs />

      <FeaturedSectionWrapper workspace={workspace} />
      <Footer />
    </main>
  );
}
