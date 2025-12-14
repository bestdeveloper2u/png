"use client";

import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
    const handlePageChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={handlePageChange}
        />
    );
}
