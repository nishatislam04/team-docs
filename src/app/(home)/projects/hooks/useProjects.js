import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Custom hook for managing projects data, using the reusable usePaginatedFetch hook.
 * @param {boolean} shouldStartFetch - Trigger for starting the fetch.
 * @param {Function} setShouldStartFetch - Function to update the fetch trigger.
 * @param {Object} initialData - Optional initial paginated payload from server to hydrate instantly.
 * @returns {Object} An object containing paginated projects data, state, and handlers.
 */
export function useProjects() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const handleSort = (column) => {
    const params = new URLSearchParams(searchParams);

    if (column === sortBy) {
      // toggle direction
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      // switch column, reset to asc
      params.set("sortBy", column);
      params.set("sortOrder", "asc");
    }

    // Reset page to 1 when sorting changes (preserve existing page if present and same column?)
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    sortBy,
    sortOrder,
    handleSort,
  };
}
