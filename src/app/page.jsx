import Header from "./_components/header";
import HeroSection from "./_components/HeroSection";
import FeaturedSection from "./_components/FeaturedSection";
import Footer from "./_components/Footer";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

export const dynamic = "force-dynamic";

/**
 * !our main job is to turn this page into partial pre rendering page.
 * ! right now, it is dynamic.
 */

export default async function LandingPage() {
  const session = await Session.getCurrentUser();
  const isAuthenticated = await Session.isAuthenticated();
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspaceStatus = workspaceId
    ? await WorkspaceService.getWorkspaceStatus(workspaceId)
    : null;

  return (
    <main className="min-h-screen bg-background">
      <Header session={session} />

      {/* both HeroSection and FeaturedSection component expecting same props. can we simply this? instead of duplicating? */}
      <HeroSection
        session={session}
        isAuthenticated={isAuthenticated}
        workspaceId={workspaceId}
        workspaceStatus={workspaceStatus}
      />
      <FeaturedSection
        session={session}
        isAuthenticated={isAuthenticated}
        workspaceId={workspaceId}
        workspaceStatus={workspaceStatus}
      />
      <Footer />
    </main>
  );
}
