"use client";

import { AsideBar } from "@/components/dashboard/asidebar/asidebar";
import { BottomBar } from "@/components/dashboard/bottombar/bottombar";
import { TopBar } from "@/components/dashboard/topbar/topbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isAuthed = useAuth();
    const router = useRouter();
    const [sideBar, setSideBar] = useState<boolean>(false);
    const handleSideBarOpen = () => {
        setSideBar(!sideBar);
    }

    useEffect(() => {
        if (!isAuthed) {
            router.replace("/user/login");
        }
    }, [isAuthed, router]);

    if (!isAuthed) {
        return null;
    }

    return (
        <section className="relative top-0 left-0 right-0 w-full h-screen text-black bg-white overflow-hidden scrollbar-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[15%_85%] justify-between w-full h-full relative">

                <div className={`${sideBar ? 'flex md:hidden' : 'hidden md:flex'} flex-col flex-wrap h-full w-full overflow-hidden scrollbar-hidden relative`}>
                    <AsideBar sideBar={sideBar} setSideBar={setSideBar} />
                </div>

                <div className={`${sideBar ? "hidden" : "flex"} flex-col flex-wrap justify-between w-full h-full relative overflow-hidden scrollbar-hidden`}>
                    <TopBar handleSideBarOpen={handleSideBarOpen} />
                    <div className="flex flex-col flex-wrap w-full h-[82%]">
                        {children}
                    </div>
                    <BottomBar />
                </div>

            </div>
        </section>
    );
}
