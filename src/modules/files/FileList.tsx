import BreadCrumb from "@/components/custom/BreadCrumb";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import FileTable from "./file-list/file-table";

const breadcrumbItems = [{ title: "Files", link: "/files" }];

export default function FileList() {
    return (
        <div className="flex-1 space-y-4 p-2 md:px-0 pt-8">
            <BreadCrumb items={breadcrumbItems} />
            <Separator />

            <Card className="overflow-hidden">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <CardTitle>Files List</CardTitle>
                            <CardDescription>Manage uploaded files</CardDescription>
                        </div>
                        <Link
                            href={"/files/upload"}
                            className={cn(buttonVariants({ variant: "default" }))}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Upload New
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <FileTable />
                </CardContent>
            </Card>
        </div>
    );
}