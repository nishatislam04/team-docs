import { getWorkspaceFn } from "./_components/actions/getWorkspace";
import FeaturedSection from "./_components/FeaturedSection";
import Footer from "./_components/Footer";
import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";

export const experimental_ppr = true;

export default async function LandingPage() {
  const workspace = getWorkspaceFn();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <HeroSection workspace={workspace} />
      <FeaturedSection workspace={workspace} />
      <Footer />
    </main>
  );
}
