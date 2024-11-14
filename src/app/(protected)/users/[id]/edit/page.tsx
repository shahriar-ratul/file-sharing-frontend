'use client';
import UpdateUser from '@/modules/users/update-user/UpdateUser';
import React from 'react';

export default function UpdateUserPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>

      <UpdateUser id={params.id} />

    </>
  );
}
