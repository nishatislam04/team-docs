"use client";

import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllWorkspacePermissions } from "../actions/getAllWorkspacePermissions";

export function usePermissions(workspaceId, shouldStartFetch, setShouldStartFetch) {
  const test = usePaginatedFetch(
    getAllWorkspacePermissions(workspaceId),
    shouldStartFetch,
    setShouldStartFetch,
  );
  return test;
}
