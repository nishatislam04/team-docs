"use server";

import { Session } from "@/lib/Session";
import { ProjectServices } from "@/system/Services/ProjectServices";

export async function getAllProjectsFn() {
  const session = await Session.getCurrentUser();
  const projects = await ProjectServices.getAllResources({ where: { ownerId: session.id } });
  return projects;
}
