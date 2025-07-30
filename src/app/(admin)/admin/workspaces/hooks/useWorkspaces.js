"use client";

import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllWorkspacesFn } from "../actions/getAllWorkspaces";

export function useWorkspaces(shouldStartFetch, setShouldStartFetch) {
  return usePaginatedFetch(getAllWorkspacesFn, shouldStartFetch, setShouldStartFetch);
}
