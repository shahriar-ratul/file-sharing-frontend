'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import { CreateUserForm } from '@/components/forms/user/create-user-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
    { title: "Users", link: "/users" },
    { title: "New User", link: "/users/create" },
];
export default function AddUser() {
    return (
        <>
            <div className='flex-1 space-y-4 p-2 md:px-0 pt-8'>
                <BreadCrumb items={breadcrumbItems} />
                <div className='flex items-start justify-between'>
                    <Heading title={'Add New User'} description='Create a new User.' />
                </div>
                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle>Add New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateUserForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
