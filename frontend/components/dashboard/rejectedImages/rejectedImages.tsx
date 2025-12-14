/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Pagination from "@/components/pagination/pagination";
import { useGetRejectedImagesQuery } from "@/redux/features/images/rejectedApi";
import { clearSelectedMetadata, closeSidebar, openSidebar, setSelectedMetadata } from "@/redux/features/imageSidebar/imageSideBarSlice";
import { RootState } from "@/redux/store";
import { ImagesResponse } from "@/types/imagesResponse";
import { ReactIcons } from "@/utils/reactIcons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { SelectedImageSidebar } from "../seletedSideBarImage/seletedSideBarImage";

export default function RejectedImagesComponent() {
    const [value, setValue] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { FaTags, IoMdClose } = ReactIcons;

    const { data, isLoading, isError, refetch } = useGetRejectedImagesQuery({
        searchTerm: value,
        pageNumber: currentPage,
    }, {
        refetchOnMountOrArgChange: true,
    });

    const dispatch = useDispatch();
    const sideBar = useSelector((state: RootState) => state.imageSideBar.sideBar);
    const selectedMetadata = useSelector(
        (state: RootState) => state.imageSideBar.selectedMetadata
    );

    const images: ImagesResponse[] = data?.images ?? [];
    const count: number = data?.count ?? 0;
    const totalPages: number = Math.ceil(count / 100);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSideBarClose = () => {
        dispatch(closeSidebar());
        dispatch(clearSelectedMetadata());
    };

    const handleImageClick = (img: any) => {
        dispatch(openSidebar());
        dispatch(setSelectedMetadata(img));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col flex-wrap items-center justify-center h-full relative">
                <div className="text-center py-10 text-gray-600">
                    Loading images...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col flex-wrap items-center justify-center h-full relative">
                <div className="text-center py-10 text-red-600">
                    Failed to load images.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row flex-wrap justify-between px-2.5 lg:px-10 pb-1 lg:pb-2.5 w-full h-full relative">
            {/* Top bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-4 py-2 w-full">
                <h4 className="text-xs lg:text-base font-semibold">
                    Rejected images: {count}
                </h4>
                <div className="flex w-full lg:w-auto flex-wrap gap-2">
                    <input
                        type="search"
                        placeholder="Search images by title…"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="flex-1 border border-gray-400 px-2 py-1.5 rounded text-sm lg:text-base outline-none"
                    />
                </div>
            </div>

            {/* Images */}
            <div className={`flex flex-row flex-wrap ${sideBar ? "w-[79%]" : "w-full"} justify-between h-[80%] lg:h-[85%] relative overflow-hidden overflow-x-hidden overflow-y-scroll scrollbar-width`}>
                <div className={`flex flex-row flex-wrap w-full`}>
                    <div className="flex flex-wrap items-center w-full h-full">
                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 lg:gap-5 py-5 w-full">
                                {images.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex flex-col items-center shadow-sm px-2.5 py-2.5 rounded-md border relative cursor-pointer border-gray-300`}
                                            onClick={() => handleImageClick(item)}
                                        >
                                            <Image
                                                className="w-full h-52 object-contain rounded-md"
                                                src={item.cloudflare_url}
                                                alt={item.title}
                                                width={208}
                                                height={208}
                                            />

                                            <div className="flex flex-row flex-wrap items-center justify-between absolute bottom-0 right-0 left-0 w-full py-2.5 px-2.5 bg-black/10 rounded-b-md z-50">
                                                <div className="flex flex-row flex-wrap items-center gap-x-1 text-gray-400">
                                                    <FaTags className="text-sm" />
                                                    <span className="text-sm">
                                                        {item.keywords?.length ?? 0}
                                                    </span>
                                                </div>
                                                <span className="w-auto h-auto p-1.5 text-sm rounded-full text-white bg-[#0077A2]">
                                                    {item?.download_count}
                                                </span>
                                                <span
                                                    className={`block w-2 h-2 rounded-full 
                                                                            ${item.status === "approved"
                                                            ? "bg-green-600"
                                                            : ""
                                                        }
                                                                            ${item.status === "rejected"
                                                            ? "bg-red-600"
                                                            : ""
                                                        }
                                                                            ${item.status === "pending"
                                                            ? "bg-yellow-500"
                                                            : ""
                                                        }`}
                                                ></span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col flex-wrap justify-center items-center w-full">
                                <p>No images found</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Sidebar */}
            {sideBar && selectedMetadata && (
                <div className="w-full lg:w-[20%] h-[90%] relative mt-5 overflow-hidden overflow-x-hidden overflow-y-scroll scrollbar-width">
                    <button
                        className="absolute top-0.5 right-0.5 z-50 bg-black text-white p-0.5 cursor-pointer rounded-full"
                        onClick={handleSideBarClose}
                    >
                        <IoMdClose className="text-lg" />
                    </button>
                    <SelectedImageSidebar selectedImageData={selectedMetadata} refetch={refetch} />
                </div>
            )}

            {/* Pagination */}
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
