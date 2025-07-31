import { Session } from "@/lib/Session";
import UserShell from "./UserShell";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import { canReadUserAuth } from "@/authorization/UserAuthGuard";

export default async function UsersPage() {
  const session = await Session.getCurrentUser();
  await requireWorkspaceActive();

  const userAuthorization = await canReadUserAuth();

  return <UserShell userAuthorization={userAuthorization} userId={session.id} />;
}
