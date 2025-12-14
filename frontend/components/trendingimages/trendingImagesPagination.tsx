"use client";

import React, { useState } from "react";
import Pagination from "../pagination/pagination";
import { useDispatch } from "react-redux";
import { setPage } from "@/redux/features/getImages/getImageSlice";

type TrendingimagesPaginationProps = {
    count: number;
};

export const TrendingImagesPagination: React.FC<TrendingimagesPaginationProps> = ({ count }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const dispatch = useDispatch();
    const safeCount = count;
    const totalPages: number = Math.ceil(safeCount / 100);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        dispatch(setPage(page));
    };

    return (
        <div className="flex flex-col flex-wrap items-center justify-center md:py-2.5 w-1/2 mx-auto mt-1.5">
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

