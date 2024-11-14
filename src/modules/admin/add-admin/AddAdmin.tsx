'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import { CreateAdminForm } from '@/components/forms/admin/create-admin-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
  { title: "Admins", link: "/admins" },
  { title: "New Admins", link: "/admins/create" },
];
export default function AddAdmin() {
    return (
        <>
            <div className='flex-1 space-y-4 p-2 md:px-0 pt-8'>
                <BreadCrumb items={breadcrumbItems} />
                <div className='flex items-start justify-between'>
                    <Heading title={'Add New Admin'} description='Create a new Admin.' />
                </div>
                <Separator />

                <Card>
                    <CardHeader>{/* <CardTitle>Admin List</CardTitle> */}</CardHeader>
                    <CardContent>
                        <CreateAdminForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
