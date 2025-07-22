import { requireWorkspaceActive } from "@/authorization/WorkspaceAuthGuard";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  await requireWorkspaceActive();

  return <div className="">HomePage</div>;
}
