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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { type AdminModel } from "@/schema/AdminSchema";
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
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import axiosInstance from "@/services/axios/axios";
import Link from "next/link";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminTable() {
  const [tableData, setTableData] = useState<AdminModel[]>([]);

  const [selectedRow, setSelectedRow] = useState<AdminModel | null>(null);
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

  const onConfirm = async () => {
    setLoading(true);
    setOpen(false);

    if (actionType === "changeStatus") {
      try {
        const { data } = await axiosInstance.post(
          `/api/v1/admins/${selectedRow?.id}/status`
        );

        if (data) {
          toast.success(`${selectedRow?.username} ${data.data.message}`, {
            style: {
              border: "1px solid #4caf50",
              padding: "16px",
              color: "#4caf50",
              backgroundColor: "#f0f4f7",
            },
            position: "top-right",
            closeButton: true,
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
          setActionType(null);
          setSelectedRow(null);
        }
      } catch (error: any) {
        toast.error(error.response.data.message as string, {
          style: {
            border: "1px solid #FF0000",
            padding: "16px",
            color: "#f0f4f7",
            backgroundColor: "#FF0000",
          },
          position: "top-right",
          closeButton: true,
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    }
    if (actionType === "delete") {
      try {
        const { data } = await axiosInstance.delete(
          `/api/v1/admins/${selectedRow?.id}`
        );

        if (data) {
          toast.success(`${selectedRow?.username} ${data.data.message}`, {
            style: {
              border: "1px solid #4caf50",
              padding: "16px",
              color: "#4caf50",
              backgroundColor: "#f0f4f7",
            },
            position: "top-right",
            closeButton: true,
            action: {
              label: "Close",
              onClick: () => {
                toast.dismiss();
              },
            },
          });
        }
      } catch (error: any) {
        toast.error(error.response.data.message as string, {
          style: {
            border: "1px solid #FF0000",
            padding: "16px",
            color: "#f0f4f7",
            backgroundColor: "#FF0000",
          },
          position: "top-right",
          closeButton: true,
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    }
    refetch();

    setLoading(false);
  };

  const columns: ColumnDef<AdminModel>[] = [
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
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <span className="ml-2 flex flex-wrap gap-2">
              {row.original.roles.map((role, index) => (
                <Badge
                  variant="default"
                  key={`${row.original.id}-role-${role.role.id}-${index}`}
                  className="text-center flex justify-center items-center"
                >
                  {role.role.name}
                </Badge>
              ))}
            </span>
          </div>
        );
      },
    },
    {
      id: "changeStatus",
      header: "Status",
      cell: ({ row }) => (
        <Button
          variant={row.original.isActive ? "default" : "destructive"}
          onClick={() => {
            setOpen(true);
            setSelectedRow(row.original);
            setActionType("changeStatus");
          }}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/admins/${row.original.id}`}
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-500 text-white">
              <p>View details</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/admins/${row.original.id}/edit`}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <Edit className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-500 text-white">
              <p>Edit details</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpen(true);
                  setSelectedRow(row.original);
                  setActionType("delete");
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-blue-500 text-white">
              <p>Delete</p>
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
      `/api/v1/admins?page=${adjustedPage}&limit=${limit}&search=${search}&isActive=${isActive}`
    );

    return data;
  };

  const { isLoading, isError, error, isFetching, refetch } = useQuery<
    boolean,
    any
  >({
    queryKey: [
      "admins-list",
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
      setTableData(data.items as AdminModel[]);

      return true;
    },
  });

  const table = useReactTable({
    data: tableData as AdminModel[],
    columns: columns as ColumnDef<AdminModel>[],
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

          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onConfirm}
            loading={loading}
          />

          <div className="flex sm:flex-wrap sm:flex-row flex-col sm:space-x-4 space-y-2 sm:space-y-0 justify-between">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-full border-2 border-purple-500"
              />
            </div>

            <div className="w-auto">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-auto">
              <Select value={role} onValueChange={(value) => setRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-auto">
              <Button
                className="w-full"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus(undefined);
                  setSearch("");
                }}
              >
                Clear
              </Button>
            </div>
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