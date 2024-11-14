"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  total: number;
  table: ReactTable<TData>;
  onPaginationChange: (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void;
}

export function DataTable<TData>({
  columns,
  data,
  total,
  table,
  onPaginationChange,
}: DataTableProps<TData>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            total
          )}{" "}
          of {total} rows.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: Number(e.target.value),
                });
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="rounded-md border border-input p-1"
              onClick={() =>
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: table.getState().pagination.pageSize,
                })
              }
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              className="rounded-md border border-input p-1"
              onClick={() =>
                onPaginationChange((old) => ({
                  pageIndex: old.pageIndex - 1,
                  pageSize: old.pageSize,
                }))
              }
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              className="rounded-md border border-input p-1"
              onClick={() =>
                onPaginationChange((old) => ({
                  pageIndex: old.pageIndex + 1,
                  pageSize: old.pageSize,
                }))
              }
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-1 flex dark:bg-white dark:text-black"
              onClick={() =>
                onPaginationChange({
                  pageIndex: table.getPageCount() - 1,
                  pageSize: table.getState().pagination.pageSize,
                })
              }
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
