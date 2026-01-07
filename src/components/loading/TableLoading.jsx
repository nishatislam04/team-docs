import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow, Table, TableBody } from "../ui/table";

export default function TableLoading({ columns = 4, withTable = false }) {
  const rows = [...Array(7)].map((_, i) => (
    <TableRow key={`skeleton-${i}`} className="animate-pulse">
      {[...Array(columns)].map((_, colIndex) => (
        <TableCell key={colIndex} className="px-6 py-5 text-center">
          <Skeleton
            className={`h-4 mx-auto rounded-md ${colIndex % 2 === 0 ? "w-3/4" : "w-1/2"}`}
          />
        </TableCell>
      ))}
    </TableRow>
  ));

  if (withTable) {
    return (
      <Table>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    );
  }

  return rows;
}
