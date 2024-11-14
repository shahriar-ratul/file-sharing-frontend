/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumb from '@/components/custom/BreadCrumb';
import { UpdateAdminForm } from '@/components/forms/admin/update-admin-form';
import Loader from '@/components/loader/Loader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { type AdminModel } from '@/schema/AdminSchema';
import axiosInstance from '@/services/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';


export default function UpdateAdmin({ id }: any) {
  const breadcrumbItems = [
    { title: "Admins", link: "/admins" },
    { title: "Update", link: `/admins/${id}/edit` },
  ];

  const session = useSession();

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
        <div className="flex-1 space-y-4 px-2 md:px-2 py-4 md:py-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title={"Admins Update"} description="update" />
          </div>
          <Separator />

          {isError ? (
            <div className="text-red-600 text-center font-bold">
              {error?.message}
            </div>
          ) : null}
          <Card>
            <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
            <CardContent>{item && <UpdateAdminForm item={item} />}</CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
