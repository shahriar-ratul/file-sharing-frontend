'use client';
import UpdateAdmin from '@/modules/admin/update-admin/UpdateAdmin';
import Forbidden from '@/modules/errorPage/Forbidden';
import React from 'react';

export default function UpdateAdminPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>

      <UpdateAdmin id={params.id} />

    </>
  );
}
