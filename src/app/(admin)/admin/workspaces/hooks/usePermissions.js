"use client";

import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { getAllWorkspacePermissions } from "../actions/getAllWorkspacePermissions";
import Logger from "@/lib/Logger";

export function usePermissions(workspaceId, shouldStartFetch, setShouldStartFetch) {
  const test = usePaginatedFetch(
    getAllWorkspacePermissions(workspaceId),
    shouldStartFetch,
    setShouldStartFetch
  );
  Logger.debug(test, "usePermissions");
  return test;
}
