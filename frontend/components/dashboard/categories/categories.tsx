"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { AddCategoryForm } from "@/components/forms/addCategoryForm";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import Image from "next/image";
import { MEDIA_URL } from "@/utils/api";
import { IoSearchOutline } from "react-icons/io5";
import SingleCategoryPopup from "@/components/popup/singleCategoryPopup";

export default function CategoriesComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [search, setSearch] = useState("");

    const { data: categoriesData, isLoading, isError, refetch } = useGetCategoriesQuery(search, {
        refetchOnMountOrArgChange: true,
    });

    return (
        <div className="flex flex-col px-4 py-4 lg:px-10 gap-y-5 w-full h-full relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full">
                {/* Add Category Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="relative inline-block px-8 py-3 rounded-full font-medium text-white overflow-hidden group cursor-pointer
                       bg-gradient-to-r from-[#0077a2] via-blue-600 to-[#38a8e9]
                       hover:from-[#38a8e9] hover:via-blue-600 hover:to-[#0077a2]
                       transition-all duration-500 ease-in-out shadow-lg
                       before:absolute before:inset-0 before:bg-white before:opacity-0 group-hover:before:opacity-10
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077a2]"
                >
                    <span className="relative z-10 text-sm sm:text-base font-semibold transition-transform duration-300 group-hover:scale-105">
                        Add Category
                    </span>
                    {/* Animated Background Shine */}
                    <span className="absolute top-0 left-0 w-0 h-full bg-white opacity-10 rotate-45 transform -translate-x-full group-hover:w-[200%] transition-all duration-700"></span>
                </button>

                {/* Search Bar */}
                <div className="relative w-full sm:w-60">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="search"
                        placeholder="Search categories..."
                        className="w-full px-5 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0077a2] focus:border-transparent
                       transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base placeholder-gray-400 bg-white/90"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <IoSearchOutline className="text-2xl" />
                    </span>
                </div>
            </div>
            {/* Content */}
            <div className="relative block w-full overflow-scroll scrollbar-hidden">

                <div className="block w-full">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
                        {isLoading && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                Loading categories...
                            </div>
                        )}
                        {isError && (
                            <div className="col-span-full text-center py-10 text-red-500">
                                Something went wrong while loading categories.
                            </div>
                        )}
                        {!isLoading && !isError && categoriesData?.data?.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No categories found.
                            </div>
                        )}
                        {!isLoading && !isError &&
                            categoriesData?.data?.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center justify-center border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer"
                                    onClick={() => setSelectedCategory(item)}
                                >
                                    {item.icon && (
                                        <div className="relative w-full h-48 sm:h-40 md:h-48">
                                            <Image
                                                src={`${MEDIA_URL}${item.icon}`}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                            />
                                        </div>
                                    )}
                                    <h4 className="text-lg font-semibold mt-3 mb-4 text-center px-2">{item.name}</h4>
                                </div>
                            ))
                        }
                    </div>

                </div>

            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-4 p-6 transform transition-transform duration-300 scale-95 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add Category</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-black text-xl cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <AddCategoryForm setIsOpen={setIsOpen} refetch={refetch} />
                    </div>
                </div>
            )}
            {selectedCategory && (
                <SingleCategoryPopup
                    categorySlug={selectedCategory.slug}
                    onClose={() => setSelectedCategory(null)}
                    refetch={refetch}
                />
            )}
        </div>
    );
}
