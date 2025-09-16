"use server";

import { Session } from "@/lib/Session";
import { ProjectServices } from "@/system/Services/ProjectServices";

export async function getHasProjects() {
  const workspaceId = await Session.getWorkspaceIdForUser();
  const hasProjects = await ProjectServices.hasResource({
    where: { workspaceId },
  });
  return hasProjects;
}
