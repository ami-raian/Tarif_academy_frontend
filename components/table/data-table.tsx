"use client";

import React, { useEffect, useRef, useState, JSX } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Minus,
  Package,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import PaginationComponent from "@/components/table/pagination-component";
import { PAGE_SIZE } from "@/components/table/page-size";
import {
  CommonTableDiv,
  CommonTooltip,
} from "@/components/table/common-components";
import { cn } from "@/lib/utils";
import SkeletonRows from "@/components/table/skeleton-rows";

export interface Column<T = Record<string, unknown>> {
  key: string;
  name: string | JSX.Element;
  isSorting?: boolean;
  width?: number | "auto";
  align?: "left" | "center" | "right";
  showFullContent?: boolean;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  tableClassNames?: string;
  columnClassNames?: string;
  pagination?: boolean;
  isLoading?: boolean;
  showSerial?: boolean;
  title?: React.ReactNode;
  showExpandable?: boolean;
  expandableRowData?: (row: T) => React.ReactNode;
  footerValues?: Record<string, string | number>;
  showFooter?: boolean;
}

const CellWithTooltip: React.FC<{
  content: string;
  width?: string | number;
}> = ({ content, width }) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = cellRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [content, width]);

  return (
    <div
      ref={cellRef}
      style={{ width: width ?? "auto" }}
      className="overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {isOverflowing ? (
        <CommonTooltip message={content}>
          <span>{content}</span>
        </CommonTooltip>
      ) : (
        content
      )}
    </div>
  );
};

export function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  totalItems = 0,
  tableClassNames = "",
  columnClassNames = "",
  pagination = true,
  isLoading = false,
  showSerial = true,
  title,
  showExpandable = false,
  expandableRowData,
  footerValues,
  showFooter = false,
}: DataTableProps<T>) {
  const searchParams = useSearchParams();
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;
  const currentPage = Number(searchParams.get("page")) || 1;
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sortedData = React.useMemo(() => {
    if (sortColumn) {
      return [...data].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortColumn];
        const bVal = (b as Record<string, unknown>)[sortColumn];
        if (
          (aVal as unknown as string | number) <
          (bVal as unknown as string | number)
        )
          return sortDirection === "asc" ? -1 : 1;
        if (
          (aVal as unknown as string | number) >
          (bVal as unknown as string | number)
        )
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [data, sortColumn, sortDirection]);

  const updatedColumns: Column[] = [
    ...(showExpandable
      ? [
          {
            name: "",
            key: "expandable",
            align: "center" as const,
          },
        ]
      : []),
    ...(showSerial
      ? [
          {
            name: "SL",
            key: "sl",
            isSorting: true,
            align: "left" as const,
            width: 30,
          },
        ]
      : []),
    ...columns,
  ];

  const renderSkeleton = () => {
    return (
      <TableBody>
        <SkeletonRows tableRows={pageSize} tableCell={updatedColumns.length} />
      </TableBody>
    );
  };

  return (
    <div className={cn("scrollbar-thin w-full", tableClassNames)}>
      <div className="text-lg font-semibold">{title}</div>
      <CommonTableDiv className={tableClassNames}>
        <Table>
          <TableHeader className="bg-accent">
            <TableRow>
              {updatedColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={` ${column.align ? `text-${column.align} ` : ""} ${columnClassNames}`}
                >
                  <div
                    className={`inline-flex items-center ${
                      column.align === "right"
                        ? "justify-end"
                        : column.align === "center"
                          ? "justify-center"
                          : "justify-start"
                    }`}
                    style={{ width: column?.width ?? "auto" }}
                  >
                    {column.name}
                    {column.isSorting && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className=""
                        onClick={() => handleSort(column.key)}
                      >
                        {sortColumn === column.key ? (
                          sortDirection === "asc" ? (
                            <ChevronsDownUp />
                          ) : (
                            <ChevronsUpDown />
                          )
                        ) : (
                          <ChevronsUpDown />
                        )}
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <TableBody>
              {sortedData.length ? (
                sortedData.map((row, rowIndex) => {
                  const rowKey: string = String(
                    (row as Record<string, unknown>).uid ||
                      (row as Record<string, unknown>).id ||
                      (row as Record<string, unknown>).key ||
                      rowIndex,
                  ); // ensure unique key
                  return (
                    <React.Fragment key={rowKey}>
                      <TableRow className="bg-white dark:bg-black">
                        {showExpandable && (
                          <TableCell align="center" className="px-0 pl-2">
                            <Button
                              variant="ghost"
                              className="size-7 align-middle"
                              size={"icon"}
                              onClick={() => toggleRow(rowKey)}
                            >
                              {expandedRows[rowKey] ? <Minus /> : <Plus />}
                            </Button>
                          </TableCell>
                        )}
                        {showSerial && (
                          <TableCell>
                            {(currentPage - 1) * pageSize + rowIndex + 1}
                          </TableCell>
                        )}
                        {columns.map((column) => (
                          <TableCell key={column.key} align={column.align}>
                            {column.showFullContent ? (
                              <div
                                style={{ width: column?.width ?? "auto" }}
                                className="wrap-break-words"
                              >
                                {String(
                                  (row as Record<string, unknown>)[column.key],
                                )}
                              </div>
                            ) : (
                              <CellWithTooltip
                                content={String(
                                  (row as Record<string, unknown>)[column.key],
                                )}
                                width={column?.width}
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {showExpandable && expandedRows[rowKey] && (
                        <TableRow className="bg-muted/20">
                          <TableCell colSpan={updatedColumns.length}>
                            {expandableRowData?.(row)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={updatedColumns.length}
                    className="h-75 text-center"
                  >
                    <div className="group flex h-full flex-col items-center justify-center gap-4">
                      <Package className="size-16 opacity-50 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                      <div className="text-lg text-muted-foreground">
                        No data
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}

          {showFooter && footerValues && (
            <TableFooter>
              <TableRow className="bg-muted font-semibold">
                {updatedColumns.map((column, index) => {
                  if (column.key === "expandable" || column.key === "sl") {
                    return <TableCell key={column.key}></TableCell>;
                  }

                  const footerKeys = Object.keys(footerValues);
                  const firstFooterKey = footerKeys[0];
                  const firstKeyIndex = updatedColumns.findIndex(
                    (col) => col.key === firstFooterKey,
                  );

                  if (index === firstKeyIndex - 1) {
                    return (
                      <TableCell
                        className="text-base"
                        key={column.key}
                        align={column.align}
                      >
                        Subtotal
                      </TableCell>
                    );
                  }

                  const value = footerValues[column.key];
                  return (
                    <TableCell
                      className="text-base"
                      key={column.key}
                      align={column.align}
                    >
                      {value !== undefined ? value : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CommonTableDiv>

      <PaginationComponent pagination={pagination} totalItems={totalItems} />
    </div>
  );
}
