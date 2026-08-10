import { canReadUserAuth } from "@/authorization/UserAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { Session } from "@/lib/Session";
import UserShell from "./UserShell";

export default async function UsersPage() {
  const session = await Session.getCurrentUser();
  await requireWorkspaceActive();

  const userAuthorization = await canReadUserAuth();

  return <UserShell userAuthorization={userAuthorization} userId={session.id} />;
}
