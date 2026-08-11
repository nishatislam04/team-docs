/**
 * Temporary dev-only delay for previewing loading states.
 * Set NEXT_PUBLIC_DEV_LOADING_DELAY=0 to disable, or remove once done testing.
 */
export async function devDelay(ms = 3000) {
  if (process.env.NODE_ENV !== "development") return;

  const delay = Number(process.env.NEXT_PUBLIC_DEV_LOADING_DELAY ?? ms);
  if (!Number.isFinite(delay) || delay <= 0) return;

  await new Promise((resolve) => setTimeout(resolve, delay));
}
