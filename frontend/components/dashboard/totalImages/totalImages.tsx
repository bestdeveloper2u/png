"use client";

import { useState } from "react";
import Pagination from "../../pagination/pagination";
import { ReactIcons } from "@/utils/reactIcons";
import { useGetTotalImagesQuery } from "@/redux/features/images/totalApi";
import Image from "next/image";
import { ImagesResponse } from "@/types/imagesResponse";

export default function TotalImagesComponent() {
    const [value, setValue] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { FaTags } = ReactIcons;

    const { data, isLoading, isError } = useGetTotalImagesQuery({
        searchTerm: value,
        pageNumber: currentPage,
    }, {
        refetchOnMountOrArgChange: true,
    });

    const images: ImagesResponse[] = data?.images ?? [];
    const count: number = data?.count ?? 0;
    const totalPages: number = Math.ceil(count / 100);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col flex-wrap items-center justify-center h-full relative">
                <div className="text-center py-10 text-gray-600">Loading images...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col flex-wrap items-center justify-center h-full relative">
                <div className="text-center py-10 text-red-600">Failed to load images.</div>
            </div>
        );
    }

    console.log("Total Images Data:", images);

    return (
        <div className="flex flex-col flex-wrap justify-between px-2.5 lg:px-10 pb-1 lg:pb-2.5 h-full relative">
            <div className="flex flex-row flex-wrap items-center justify-between h-[10%] lg:h-[7%]">
                <h4 className="text-xs lg:text-base font-semibold">Total images: {count}</h4>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <input
                        type="search"
                        placeholder="Search images by title…"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="border border-gray-400 px-1 lg:px-2 py-1.5 rounded text-sm lg:text-base font-normal outline-none"
                    />
                </div>
            </div>
            <div className="flex flex-row flex-wrap justify-between w-full overflow-hidden h-[80%] lg:h-[85%]">
                <div className="flex flex-wrap items-center w-full h-full overflow-x-hidden overflow-y-scroll scrollbar-width">
                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 lg:gap-5 py-5 w-full">
                            {images.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center shadow-sm px-2.5 py-2.5 rounded-md border border-gray-300 relative"
                                >
                                    <Image
                                        className="w-full h-52 object-contain rounded-md cursor-pointer"
                                        src={item.cloudflare_url}
                                        alt={item.title}
                                        width={208}
                                        height={208}
                                    />

                                    <div className="flex flex-row flex-wrap items-center justify-between absolute bottom-0 right-0 left-0 w-full py-2.5 px-2.5 bg-black/10 rounded-b-md z-50">
                                        <div className="flex flex-row flex-wrap items-center gap-x-1 text-gray-400">
                                            <FaTags className="text-sm" />
                                            <span className="text-sm">{item.keywords?.length ?? 0}</span>
                                        </div>
                                        <span className="w-auto h-auto p-1.5 text-sm rounded-full text-white bg-[#0077A2]">{item?.download_count}</span>
                                        <span
                                            className={`block w-2 h-2 rounded-full 
                                            ${item.status === "approved" ? "bg-green-600" : ""}
                                            ${item.status === "rejected" ? "bg-red-600" : ""}
                                            ${item.status === "pending" ? "bg-yellow-500" : ""}`}
                                        ></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col flex-wrap justify-center items-center w-full">
                            <p>No images found</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col flex-wrap justify-center items-center w-full h-[5%]">
                <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
