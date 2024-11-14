"use client";

import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";



import Loader from "@/components/loader/Loader";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UserModel } from "@/schema/UserSchema";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Edit, Eye, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { AlertModal } from "@/components/custom/modal/alert-modal";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FileModel } from "@/schema/FileSchema";
import axiosInstance from "@/services/axios/axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export default function FileTable() {
  const [tableData, setTableData] = useState<FileModel[]>([]);

  const [selectedRow, setSelectedRow] = useState<FileModel | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const session = useSession();

  const [status, setStatus] = useState<string | undefined>(undefined);

  // Search param
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const [search, setSearch] = useState("");
  const [searchKey] = useDebounce(search, 500);

  const [role, setRole] = useState<string | undefined>(undefined);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<FileModel>[] = [
    {
      accessorKey: "id",
      header: "Serial No.",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="ml-2">
              {row.index + 1 + pagination.pageSize * pagination.pageIndex}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "thumbnailPath",
      header: "Thumbnail",
      cell: ({ row }) => {
        return row.original.thumbnailPath ? <Image src={row.original.thumbnailPath} alt="Thumbnail" width={100} height={100} /> : null;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },


    {
      accessorKey: "fileType",
      header: "Type",
    },
    {
      accessorKey: "viewCount",
      header: "Views",
    },


    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/files/${row.original.id}`}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-500 text-white">
              <p>View details</p>
            </TooltipContent>
          </Tooltip>



        </div>
      ),
    },
  ];

  const fetchData = async (
    page: number,
    limit: number,
    search: string,
    status: string | undefined
  ) => {
    const adjustedPage = page === 0 ? 1 : page;

    let isActive = null;

    if (status === "active") {
      isActive = true;
    }

    if (status === "inactive") {
      isActive = false;
    }

    const { data } = await axiosInstance.get(
      `/api/v1/files?page=${adjustedPage}&limit=${limit}&search=${search}&isActive=${isActive}`
    );

    return data;
  };

  const { isLoading, isError, error, isFetching, refetch } = useQuery<
    boolean,
    any
  >({
    queryKey: [
      "files-list",
      pagination.pageIndex,
      pagination.pageSize,
      searchKey,
      status,
    ],
    queryFn: async () => {
      const { data } = await fetchData(
        pagination.pageIndex + 1,
        pagination.pageSize,
        searchKey,
        status
      );

      setTotalPages(data.meta.pageCount as number);
      setTotal(data.meta.total as number);
      setTableData(data.items as FileModel[]);

      return true;
    },
  });

  const table = useReactTable({
    data: tableData as FileModel[],
    columns: columns as ColumnDef<FileModel>[],
    pageCount: totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    refetch();
  }, [pagination, refetch]);

  return (
    <>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {isError ? (
            <div className="text-red-600 text-center font-bold">
              {error?.message}
            </div>
          ) : null}


          <div className="flex sm:flex-wrap sm:flex-row flex-col sm:space-x-4 space-y-2 sm:space-y-0 justify-between">


          </div>

          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "id" ? "Serial No." : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DataTable
            columns={columns}
            data={tableData}
            total={total}
            table={table}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </>
  );
}