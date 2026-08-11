"use server";

import { devDelay } from "@/lib/devDelay";
import { Session } from "@/lib/Session";

export async function getSession() {
  await devDelay();
  return await Session.getCurrentUser();
}
