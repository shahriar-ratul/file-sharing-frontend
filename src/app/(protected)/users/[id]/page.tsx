'use client';
import DetailsUser from '@/modules/users/details-user/DetailsUser';
import React from 'react';

export default function DetailsUserPage({
    params,
}: {
    params: { id: string };
}) {
    return <DetailsUser id={params.id} />;
}
