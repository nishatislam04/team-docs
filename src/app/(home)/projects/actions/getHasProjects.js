"use server";

import { ProjectServices } from "@/system/Services/ProjectServices";
import { Session } from "@/lib/Session";

export async function getHasProjects() {
  const workspaceId = await Session.getWorkspaceIdForUser();
  const hasProjects = await ProjectServices.hasResource({
    where: { workspaceId },
  });
  return hasProjects;
}
