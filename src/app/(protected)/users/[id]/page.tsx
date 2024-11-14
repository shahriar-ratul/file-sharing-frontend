'use client';
import DetailsAdmin from '@/modules/admin/details-admin/DetailsAdmin';
import Forbidden from '@/modules/errorPage/Forbidden';
import React from 'react';

export default function DetailsAdminPage({
    params,
}: {
    params: { id: string };
}) {
    return <DetailsAdmin id={params.id} />;
}
