"use client";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Forbidden from "@/modules/errorPage/Forbidden";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import AdminTable from "./user-list/user-table";

const breadcrumbItems = [{ title: "Users", link: "/users" }];
export default function UsersList() {
  return (
    <>

      <div className="flex-1 space-y-4 p-2 md:px-0 pt-8 ">
        <BreadCrumb items={breadcrumbItems} />
        {/* <div className="flex items-start justify-between"> */}
        {/* <Heading title={"Admins List"} description="Manage admins" /> */}

        {/* <Link
              href={"/admins/create"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link> */}
        {/* </div> */}
        <Separator />

        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              {/* <Heading title={"Admins List"} description="Manage admins" /> */}
              <div className="flex flex-col">
                <CardTitle>Users List</CardTitle>
                <CardDescription>Manage users</CardDescription>
              </div>
              <Link
                href={"/users/create"}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <AdminTable />
          </CardContent>
        </Card>
      </div>

    </>
  );
}
