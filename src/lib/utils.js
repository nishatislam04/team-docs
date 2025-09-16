import { clsx } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * This is our authorization toast message showing helper function.
 * this message will be written on the url
 *
 * @param {string} message provide message that will be shown on the toast
 * @param {string} redirectUrl redirect to the url
 */
export function notify(message = "", redirectUrl = "/?unauthorized=") {
  redirect(`${redirectUrl}${encodeURIComponent(message)}`);
}
