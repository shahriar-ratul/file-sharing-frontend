'use client';
import BreadCrumb from '@/components/custom/BreadCrumb';
import { UploadFileForm } from '@/components/forms/file/upload-file-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
    { title: "Files", link: "/files" },
    { title: "New Upload", link: "/files/upload" },
];
export default function AddUpload() {
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
                        <CardTitle>Add New Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UploadFileForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
