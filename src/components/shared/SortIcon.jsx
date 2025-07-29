import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

export default function SortIcon({ column, sortBy, sortOrder }) {
  if (column === sortBy) {
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-2 w-4 h-4" />
    ) : (
      <ChevronDown className="ml-2 w-4 h-4" />
    );
  }
  return <ArrowUpDown className="ml-2 w-4 h-4 opacity-50" />;
}
