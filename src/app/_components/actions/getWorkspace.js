"use server";

import { devDelay } from "@/lib/devDelay";
import { Session } from "@/lib/Session";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";

export async function getWorkspaceFn() {
  await devDelay();
  const session = await Session.getCurrentUser();

  let workspaceId = session?.workspaceId;
  workspaceId === null && (workspaceId = await Session.getWorkspaceIdForUser());

  const workspaceStatus = workspaceId
    ? await WorkspaceServices.getWorkspaceStatus(workspaceId)
    : null;

  return { workspaceId, workspaceStatus };
}
