import { useRouter, useSearchParams } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { setRoute } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PAGE_SIZE } from "@/components/table/page-size";

interface PaginationComponentProps {
  currentPage?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPageSize?: number;
  setCurrentPageSize?: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  pagination?: boolean;
}

export default function PaginationComponent({
  totalItems,
  pagination = true,
  currentPage,
  setCurrentPage,
  currentPageSize,
  setCurrentPageSize,
}: PaginationComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = currentPage || Number(searchParams.get("page")) || 1;
  const pageSize =
    currentPageSize || Number(searchParams.get("pageSize")) || PAGE_SIZE;

  const onPageChange = (newPage: number) => {
    if (setCurrentPage) {
      setCurrentPage(newPage);
    } else {
      setRoute(router, {
        query: {
          page: newPage,
        },
      });
    }
  };

  const onPageSizeChange = (newPageSize: string) => {
    if (setCurrentPageSize) {
      setCurrentPageSize(Number(newPageSize));
    } else {
      setRoute(router, {
        query: {
          page: 1,
          pageSize: newPageSize,
        },
      });
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      {pagination && totalItems > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={onPageSizeChange}
            >
              <SelectTrigger className="h-9 w-20">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent className="min-w-24">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          <div className="inline-flex h-10 items-center text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, totalItems)} of {totalItems} entries
          </div>

          {totalItems > pageSize ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange?.(pageNum)}
                    className="w-9"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* <Button variant={'outline'} disabled size="sm" className="w-9">
                ...
              </Button>

              {Array.from({ length: Math.max(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange?.(pageNum)}
                    className="w-9"
                  >
                    {pageNum}
                  </Button>
                );
              })} */}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button disabled variant={"default"} size="sm" className="w-9">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
