import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  const session = await Session.getCurrentUser();
  Logger.debug(session, "session");
  await requireWorkspaceActive();

  return <div className="">HomePage</div>;
}
