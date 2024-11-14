"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import MobileSidebar from "@/components/layout/MobileSidebar";
import { Button } from "@/components/ui/button";

import ThemeToggle from "@/components/layout/ThemeToggle";
import UserMenu from "@/components/layout/UserMenu";
import axiosInstance from "@/services/axios/axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Setting from "./Setting";
import SwtichLanguage from "./SwitchLanguage";
import React from "react";

export default function Header() {
  const session = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const navRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  async function verify() {
    const { data } = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.user?.accessToken}`,
        },
      }
    );

    if (!data.success) {
      signOut();
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (session?.data?.user?.accessToken && pathname !== "/login") {
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        setScroll(!entries[0].isIntersecting);
      },
      {
        root: null,
        rootMargin: "10px 0px",
        threshold: 0,
      }
    );

    if (navRef.current) {
      intersectionObserver.observe(navRef.current);
    }

    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20 px-6 xl:w-[calc(100%-240px)] w-full "
        )}
      >
        <nav className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-0">
            <Button
              variant="ghost"
              className="-ml-3 xl:hidden"
              size="icon"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </Button>

            <div className="flex items-center gap-0">
              {/* <h1 className="text-2xl font-bold">LOGO</h1> */}
              <Image
                src="/images/logo/logo.png"
                alt="logo"
                width={120}
                height={120}
                className="h-[50px] object-contain md:block hidden cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              />

              <Image
                src="/images/logo/logo.png"
                alt="logo"
                width={120}
                height={40}
                className="h-[40px] object-contain md:hidden sm:block cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SwtichLanguage />
            <ThemeToggle />
            <Setting />
            <UserMenu
              user={{
                name: session?.data?.user?.name ?? "",
                image: "https://avatars.dicebear.com/api/avatars/123.svg",
                email: session?.data?.user?.email ?? "",
              }}
            />
          </div>
        </nav>
      </div>

      <MobileSidebar open={open} onOpenChange={setOpen} />
    </>
  );
}
