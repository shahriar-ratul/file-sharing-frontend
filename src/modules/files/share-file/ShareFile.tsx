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
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Copy } from "lucide-react";
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from "sonner";


export default function ShareFile({ id }: any) {

    const [item, SetItem] = useState<FileModel | null>(null);

    // Query to get view count
    const { data: views } = useQuery({
        queryKey: ["file-views", id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/v1/files/public/${id}/views`);
            return data.views;
        },
    });

    // Mutation for incrementing view count
    const { mutate: incrementView } = useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.post(`/api/v1/files/public/${id}/view`);
            return data;
        },
    });

    const fetchData = async () => {
        const { data } = await axiosInstance.get(`/api/v1/files/public/${id}`);
        return data;
    };

    const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
        queryKey: ["files-list", id],
        queryFn: async () => {
            const { data } = await fetchData();
            SetItem(data.item as FileModel);
            // Increment view count when data is fetched
            await incrementView();
            return true;
        },
    });

    return (
        <>
            {isLoading || isFetching ? (
                <Loader />
            ) : (
                <div className="flex-1 space-y-4 p-2 md:px-0 pt-8">

                    <div className="flex items-start justify-between">
                        <Heading title={"Share File"} description="Share File" />
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
                            <div className="text-sm text-muted-foreground">
                                Views: {item?.viewCount || 0}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {item && (
                                <div>
                                    <div className="grid grid-cols-3 gap-2">

                                        <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium leading-none">
                                                    Tags:
                                                    {item.FileTag.map((tagItem: any) => (
                                                        <Badge key={tagItem.id}>
                                                            {tagItem.tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Title : {item.title}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

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
                </div >
            )
            }
        </>
    );
}
