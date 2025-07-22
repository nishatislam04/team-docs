import { Session } from "@/lib/Session";
import UserShell from "./UserShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export default async function UsersPage() {
  const session = await Session.getCurrentUser();
  await requireWorkspaceActive();

  return <UserShell userId={session.id} />;
}
