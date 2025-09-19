"use server";

import { Session } from "@/lib/Session";

export async function getSession() {
  return await Session.getCurrentUser();
}
