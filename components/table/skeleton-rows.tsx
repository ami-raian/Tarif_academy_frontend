import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

const SkeletonRows = ({
  tableRows,
  tableCell,
}: {
  tableRows: number;
  tableCell: number;
}) => {
  return Array.from(new Array(tableRows)).map((_, index) => (
    <TableRow key={index}>
      {Array.from(new Array(tableCell)).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="w-full min-w-4 rounded-md py-2" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default SkeletonRows;
