import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export default async function MainPage() {
  await requireWorkspaceActive();

  return <div className="">Workspace HomePage</div>;
}
