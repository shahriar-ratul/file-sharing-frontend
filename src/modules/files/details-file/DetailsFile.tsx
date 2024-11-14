/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumb from '@/components/custom/BreadCrumb';
import Loader from '@/components/loader/Loader';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import { FileModel } from '@/schema/FileSchema';
import axiosInstance from '@/services/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Copy } from "lucide-react";
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from "sonner";


export default function DetailsFile({ id }: any) {
    const breadcrumbItems = [
        { title: "Files", link: "/files" },
        { title: "Details", link: `/files/${id}` },
    ];

    const [item, SetItem] = useState<FileModel | null>(null);
    const fetchData = async () => {
        const { data } = await axiosInstance.get(`/api/v1/files/${id}`);
        return data;
    };

    const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
        queryKey: ["files-list", id],
        queryFn: async () => {
            const { data } = await fetchData();


            SetItem(data.item as FileModel);

            return true;
        },
    });

    return (
        <>
            {isLoading || isFetching ? (
                <Loader />
            ) : (
                <div className="flex-1 space-y-4 p-2 md:px-0 pt-8">
                    <BreadCrumb items={breadcrumbItems} />
                    <div className="flex items-start justify-between">
                        <Heading title={"Details"} description="Details of File" />
                    </div>
                    <Separator />

                    {isError ? (
                        <div className="text-red-600 text-center font-bold">
                            {error?.message}
                        </div>
                    ) : null}
                    <Card>
                        <CardHeader>
                            <CardTitle>File Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {item && (
                                <>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    Title : {item.title}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    Type : {item.fileType}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium leading-none">
                                                    Tags:{" "}
                                                    {item.FileTag.map((tagItem: any) => (
                                                        <Badge key={tagItem.id} className="ml-1">
                                                            {tagItem.tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium leading-none">
                                                    Views: {item.viewCount || 0}
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Created At :{" "}
                                                {item.createdAt &&
                                                    format(item.createdAt, "dd-MM-yyyy HH:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none mb-2">
                                                Share URL:
                                            </p>
                                            <div className="flex gap-2">
                                                <Input
                                                    readOnly
                                                    value={`${window.location.origin}/share/files/${item.id}`}
                                                />
                                                <Button
                                                    size="icon"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/share/files/${item.id}`);
                                                        toast.success("Share URL copied to clipboard");
                                                    }}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>

                        <CardContent>
                            <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
                                {item?.fileType === "image" ? "Image" : "Video"}
                            </h3>

                            {item?.fileType === "image" ? (
                                <Image src={item.url} alt="File" width={500} height={500} />
                            ) : (
                                item &&
                                <video
                                    src={item.url}
                                    controls
                                    className="w-full max-w-[500px] h-auto"
                                >
                                    <track kind="captions" label="English" srcLang="en" src="" default />
                                </video>
                            )}

                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
