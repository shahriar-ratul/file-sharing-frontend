"use client";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Template = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  const router = useRouter();

  const pathName = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(DEFAULT_LOGIN_REDIRECT);
    }
  }, [session.status]);

  return <>{children}</>;
};
export default Template;
