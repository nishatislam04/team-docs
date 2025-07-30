"use server";

import { WorkspaceServices } from "@/system/Services/WorkspaceServices";

export async function getAllWorkspacesFn(options = {}) {
  const { page = 1, pageSize = 10, sortBy = "name", sortOrder = "asc" } = options;
  const workspaces = await WorkspaceServices.getAllWorkspaces({
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  return {
    data: workspaces.data,
    totalItems: workspaces.totalItems,
    pageSize: workspaces.pageSize,
    sortBy: workspaces.sortBy,
    sortOrder: workspaces.sortOrder,
  };
}
