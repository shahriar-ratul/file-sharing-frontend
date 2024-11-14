/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumb from '@/components/custom/BreadCrumb';
import Loader from '@/components/loader/Loader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { type AdminModel } from '@/schema/AdminSchema';
import axiosInstance from '@/services/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';




export default function DetailsAdmin({ id }: any) {
  const breadcrumbItems = [
    { title: "Admins", link: "/admins" },
    { title: "Details", link: `/admins/${id}` },
  ];

  const [item, SetItem] = useState<AdminModel | null>(null);
  const fetchData = async () => {
    const { data } = await axiosInstance.get(`/api/v1/admins/${id}`);
    return data;
  };

  const { isLoading, isError, error, isFetching } = useQuery<boolean, any>({
    queryKey: ["admins-list", id],
    queryFn: async () => {
      const { data } = await fetchData();

      SetItem(data.data as AdminModel);

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
            <Heading title={"Admins Details"} description="Details of Admin" />
          </div>
          <Separator />

          {isError ? (
            <div className="text-red-600 text-center font-bold">
              {error?.message}
            </div>
          ) : null}
          <Card>
            <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
            <CardContent>
              {item && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Name : {item.firstName} {item.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Email : {item.email}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Phone : {item.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          DOB : {item.dob && format(item.dob, "dd-MM-yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Joined :{" "}
                          {item.joinedDate &&
                            format(item.joinedDate, "dd-MM-yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Last Login :{" "}
                          {item.lastLogin &&
                            format(item.lastLogin, "dd-MM-yyyy HH:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Status : {item.isActive ? "Active" : "Inactive"}
                      </p>
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
                </>
              )}
            </CardContent>

            <CardContent>
              <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
                Photo
              </h3>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
                <li className="relative h-32 rounded-md shadow-lg">
                  {item?.photo && (
                    <Image
                      src={item?.photo}
                      alt={item?.photo}
                      width={100}
                      height={100}
                      onLoad={() => {
                        if (item?.photo) {
                          URL.revokeObjectURL(item?.photo as string);
                        }
                      }}
                      className="h-full w-full object-contain rounded-md"
                    />
                  )}

                  <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                    {item?.photo}
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
