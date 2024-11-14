'use client';

import ShareFile from '@/modules/files/share-file/ShareFile';
import React from 'react';

export default function DetailsUserPage({
    params,
}: {
    params: { id: string };
}) {
    return <ShareFile id={params.id} />;
}
