import { auth } from "@/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // if (!session?.user) {
  //   return null
  // }

  return (
    <>
      <SessionProvider session={session}>
        <Header />
        <Sidebar className="fixed hidden border-r xl:flex" />
        <div className="mt-24 pb-8 xl:pl-[256px] md:px-10 sm:px-5">
          {children}
        </div>
      </SessionProvider>
    </>
  );
}
