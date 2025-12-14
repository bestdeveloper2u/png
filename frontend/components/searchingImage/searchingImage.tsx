/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { setKeyword } from "@/redux/features/getImages/getImageSlice";
import { RootState } from "@/redux/store";
import { ReactIcons } from "@/utils/reactIcons";
import { getSearchSchema } from "@/utils/searchSchema";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// balloon png images

export const SearchingImage: React.FC = () => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState<string>("");
    const title = useSelector((state: RootState) => state.search.title);
    const { IoSearchOutline } = ReactIcons;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchValue(val);
        dispatch(setKeyword(val));
    };

    const { data: categoriesData } = useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });

    const category_list = categoriesData?.data;
    const schema = getSearchSchema(title);

    return (
        <section className="relative top-0 left-0 right-0 pb-2.5 md:pb-5 w-full bg-[#0077a2]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap items-center justify-center gap-y-5 w-full">
                    <h1 className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-center uppercase">
                        Free download transparent png files
                    </h1>
                    <div className="flex flex-col flex-wrap w-full lg:w-[95%] xl:w-[60%] relative">
                        <input
                            className="bg-transparent text-white placeholder:text-white text-sm xl:text-base font-normal pl-4 md:pl-5 pr-[12%] md:pr-20 py-3 sm:py-4 border md:border-2 border-white outline-none rounded-full w-full [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                            type="search"
                            name="search"
                            placeholder="Search images..."
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                        <button
                            className="absolute right-3 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                            type="button"
                        >
                            <IoSearchOutline className="text-white text-3xl md:text-4xl font-bold" />
                        </button>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        />
                    </div>
                    <div className="flex flex-row flex-wrap gap-1.5 md:gap-3.5 items-center justify-center w-full lg:w-[95%] xl:w-[62%] pb-2.5">
                        {category_list?.map((item: any) => (
                            <div key={item.id}>
                                <Link
                                    className="text-white text-xs xl:text-base font-medium cursor-pointer border-b md:border-b-2 hover:text-gray-300 duration-300"
                                    type="button"
                                    href={`/categories/${item.slug}`}
                                >
                                    {item.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
