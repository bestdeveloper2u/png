/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams } from 'next/navigation';
import { ReactIcons } from '@/utils/reactIcons';
import Link from 'next/link';
import Image from 'next/image';
import { Logout } from '@/components/logout/logout';
import { AdminMenu, UserMenu } from '@/utils/menu';
import PPLogo from "../../../public/PP-logo-white.png";

export const AsideBar = ({ sideBar, setSideBar }: any) => {
    const auth = useSelector((state: RootState) => state.auth);
    const params = useParams();

    const [hydrated, setHydrated] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        setHydrated(true);
    }, []);

    // Do not render anything until client is hydrated and auth/username exist
    if (!hydrated || !auth?.user || !params?.username) return null;

    const username = params.username;
    const role = auth.user.role;
    const defaultOpenId = AdminMenu.find((item) => item.submenu)?.id ?? null;

    // Initialize openMenuId only after hydration
    if (openMenuId === null) setOpenMenuId(defaultOpenId);

    const toggleSubmenu = (id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const { IoMdClose } = ReactIcons;

    const menuToRender = role === 'admin' ? AdminMenu : UserMenu;
    const basePath = role === 'admin' ? `/dashboard/admin/${username}` : `/dashboard/contributor/${username}`;

    return (
        <div className="flex flex-col h-full py-2.5 px-5 space-y-5 overflow-y-scroll overflow-x-hidden scrollbar-hidden text-white bg-[#0077A2]">
            {/* Logo */}
            <Link
                className="w-20 lg:w-28 xl:w-40 h-auto block"
                href={`${basePath}/`}
                onClick={() => setSideBar(false)}
            >
                <Image src={PPLogo} alt="png-point" width={200} height={200} className="w-fit h-auto" />
            </Link>

            {/* Menu */}
            <div className="flex flex-col flex-wrap space-y-8">
                {menuToRender.map((item) => (
                    <li className="flex flex-row flex-wrap items-center list-none" key={`${item.id}-${item.name}`}>
                        {item.submenu ? (
                            <>
                                <div className="flex flex-row flex-wrap items-center gap-x-2 w-full">
                                    {item.icon && <>{item.icon}</>}
                                    <div className="w-fit relative group">
                                        <button
                                            className="w-fit text-left capitalize text-sm xl:text-base font-medium cursor-pointer"
                                            onClick={() => toggleSubmenu(item.id!)}
                                        >
                                            {item.name}
                                        </button>
                                        <span className="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </div>
                                </div>
                                {openMenuId === item.id && (
                                    <ul className="flex flex-col flex-wrap ml-7 mt-3.5 space-y-3.5 w-full lg:w-auto">
                                        {item.submenu.map((sub: any) => (
                                            <li className="list-disc w-fit relative group" key={sub.id}>
                                                <Link
                                                    href={`${basePath}${sub.path!}`}
                                                    onClick={() => setSideBar(false)}
                                                    className="block text-sm xl:text-base font-medium capitalize"
                                                >
                                                    {sub.name}
                                                </Link>
                                                <span className="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                            </li>
                                        ))}
                                        <li className="list-disc w-fit relative group">
                                            <Logout style={"text-sm xl:text-base font-medium"} />
                                            <span className="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </li>
                                    </ul>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-row flex-wrap items-center gap-x-2 relative">
                                {item.icon && <>{item.icon}</>}
                                <Link
                                    href={`${basePath}${item.path!}`}
                                    onClick={() => setSideBar(false)}
                                    className="capitalize block text-sm xl:text-base font-medium w-fit relative group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </div>
                        )}
                    </li>
                ))}
            </div>

            {/* Mobile close button */}
            <button
                className='block absolute top-2 right-2 bg-black text-white p-1 rounded-full lg:hidden'
                type='button'
                onClick={() => setSideBar(!sideBar)}
            >
                <IoMdClose className='text-xl' />
            </button>
        </div>
    );
};
