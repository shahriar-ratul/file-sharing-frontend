'use client';
import DetailsFile from '@/modules/files/details-file/DetailsFile';
import React from 'react';

export default function DetailsUserPage({
    params,
}: {
    params: { id: string };
}) {
    return <DetailsFile id={params.id} />;
}
