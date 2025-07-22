import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export default async function ProfilePage() {
  await requireWorkspaceActive();
  return <div className="">ProfilePage</div>;
}
