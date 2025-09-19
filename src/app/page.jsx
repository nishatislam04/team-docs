import { getSession } from "./_components/actions/getSession";
import { getWorkspaceFn } from "./_components/actions/getWorkspace";
import Footer from "./_components/Footer";
import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";
import FeaturedSectionWrapper from "./_components/sub/FeaturedSectionWrapper";

export const experimental_ppr = true;

export default async function LandingPage() {
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
