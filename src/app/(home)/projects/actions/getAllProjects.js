"use server";

import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { ProjectServices } from "@/system/Services/ProjectServices";

/**
 * Server action to fetch all projects with pagination and sorting support
 * @param {Object} options - Pagination and sorting options
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.sortBy - Field to sort by (currently only 'name')
 * @param {string} options.sortOrder - Sort direction ('asc' or 'desc')
 * @returns {Promise<{data: Array, totalItems: number, totalPages: number, sortBy: string, sortOrder: string}>}
 */
export async function getAllProjectsFn(options = {}) {
  const workspaceId = await Session.getWorkspaceIdForUser();
  const { page = 1, pageSize = 2, sortBy = "name", sortOrder = "asc" } = options;

  const whereClause = { workspaceId };

  // Get total count for pagination
  const totalItems = await ProjectServices.countResources({ where: whereClause });

  Logger.debug(
    { page, pageSize, sortBy, sortOrder, whereClause, totalItems },
    "executed getAllProjectsFn"
  );

  // Calculate pagination parameters
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Prepare sort options
  const orderBy = { [sortBy]: sortOrder };

  // Get paginated and sorted data
  const projects = await ProjectServices.getAllResources({
    where: whereClause,
    pagination: { skip, take },
    orderBy,
  });

  return {
    data: projects,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    sortBy,
    sortOrder,
  };
}
