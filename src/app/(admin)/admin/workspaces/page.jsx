import WorkspaceShell from "./WorkspaceShell";

export default function WorkspacePage() {
  const hasWorkspaces = true;
  return (
    <>
      <WorkspaceShell hasWorkspaces={hasWorkspaces} />
    </>
  );
}
