"use client";

import { ReactIcons } from "@/utils/reactIcons";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../public/PNGPOINT-White-logo.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setTitle } from "@/redux/features/getImages/getImageSlice";
import { getSearchSchema } from "@/utils/searchSchema";

export const SingleImageHeader: React.FC = () => {
    const { IoSearchOutline } = ReactIcons;
    const dispatch = useDispatch();
    const title = useSelector((state: RootState) => state.search.title);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        dispatch(setTitle(val));
    };
    const schema = getSearchSchema(title);
    return (
        <header className="relative top-0 left-0 right-0 py-1.5 w-full bg-[#0077a2]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-row flex-wrap justify-between items-center w-full">
                    <Link className="block w-fit" href={"/"}>
                        <Image
                            className="w-32 sm:w-40 md:w-56 h-auto"
                            src={Logo}
                            alt="pngpoint"
                            width={244}
                            height={244}
                            loading="eager"
                            priority
                        />
                    </Link>
                    <div className="flex flex-col flex-wrap items-center relative w-[60%] md:w-[50%]">
                        <input
                            className="bg-transparent text-white placeholder:text-white text-sm md:text-base font-normal pl-4 md:pl-5 pr-20 py-3 md:py-4 border md:border-2 border-white outline-none rounded-full w-full [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                            type="search"
                            name="search"
                            placeholder="Search images..."
                            value={title}
                            onChange={handleInputChange}
                        />
                        <button className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 cursor-pointer" type="button">
                            <IoSearchOutline className="text-white text-3xl md:text-4xl font-bold" />
                        </button>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
