"use client";

import SortIcon from "@/components/shared/SortIcon";
import { TableHead } from "@/components/ui/table";
import { useProjects } from "../../hooks/useProjects";

export default function ProjectTableSort({ columnName }) {
  const { sortBy, sortOrder, handleSort } = useProjects();

  return (
    <TableHead
      className="hover:bg-muted/80 w-[160px] cursor-pointer px-6 py-4 transition-colors"
      onClick={() => handleSort(columnName)}
    >
      <div className="flex items-center">
        {columnName}
        <SortIcon columnName={columnName} sortBy={sortBy} sortOrder={sortOrder} />
      </div>
    </TableHead>
  );
}
