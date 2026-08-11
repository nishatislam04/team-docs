import { forbidden } from "next/navigation";
import { canReadUserAuth } from "@/authorization/UserAuthGuard";
import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";
import UserShell from "./UserShell";

export default async function UsersPage() {
  await requireWorkspaceActive();

  const userAuthorization = await canReadUserAuth();
  if (userAuthorization.success === false) forbidden();

  return <UserShell />;
}
