/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ReactIcons } from "@/utils/reactIcons";
import Image from "next/image";
import Link from "next/link";
import { useGetUserQuery } from "@/redux/features/auth/authApi";

export const TopBar = ({ handleSideBarOpen }: any) => {
    const auth = useSelector((state: RootState) => state.auth);
    const { FaRegCircleUser, HiOutlineMenu } = ReactIcons;

    const [hydrated, setHydrated] = useState(false);

    // Hydration effect
    useEffect(() => {
        setHydrated(true);
    }, []);

    const username = auth?.user?.username;
    const role = auth?.user?.role;

    const { data } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const user = data?.[0];

    // Do not render until client-side hydration + username + role ready
    if (!hydrated || !username || !role) return null;

    const basePath = role === "admin" ? `/dashboard/admin/${username}` : `/dashboard/contributor/${username}`;

    return (
        <div className="flex flex-row flex-wrap items-center justify-between h-[9%] xl:h-[10%] px-2.5 lg:px-5 xl:px-10 border-b overflow-hidden bg-white border-[#d6cece]">
            <button className="block cursor-pointer md:hidden" type="button" onClick={() => handleSideBarOpen()}>
                <HiOutlineMenu className="text-2xl" />
            </button>

            {/* Upload Button */}
            <Link
                className="bg-white btn-style rounded-full px-10 lg:px-14 py-2.5 lg:py-4 relative border border-[#38a8e9] uppercase font-medium text-[10px] sm:text-xs xl:text-sm overflow-hidden hover:text-white hover:border-black"
                href={`${basePath}/upload-images/`}
            >
                <span className="absolute inset-0 bg-black"></span>
                <span className="absolute inset-0 flex justify-center items-center font-semibold">
                    Upload
                </span>
                Upload
            </Link>

            {/* Profile Link */}
            <Link className="cursor-pointer" href={`${basePath}/profile/`}>
                {user?.image ? (
                    <Image
                        className="w-16 h-16 object-cover rounded-full"
                        src={user?.image}
                        alt={user.username}
                        width={64}
                        height={64}
                    />
                ) : (
                    <FaRegCircleUser className="text-3xl lg:text-5xl font-semibold text-[#38a8e9]" />
                )}
            </Link>
        </div>
    );
};
