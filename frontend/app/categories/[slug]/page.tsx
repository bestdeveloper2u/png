/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MEDIA_URL, SERVER_URL } from "@/utils/api";

export default function SingleCategory() {
    const { slug } = useParams();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/images/categories/${slug}/`, {
                    next: {revalidate: 180}
                });
                if (!res.ok) throw new Error("Failed to fetch category");
                const data = await res.json();
                setCategory(data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [slug]);

    // ------------------ Loading State ------------------
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-[#FBFAFF]">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-xl text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    // ------------------ Error State ------------------
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-[#FBFAFF]">
                <div className="flex flex-col items-center px-4">
                    <svg
                        className="w-16 h-16 text-red-500 mb-4 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                        />
                    </svg>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h1>
                    <p className="text-center text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    // ------------------ Normal UI ------------------
    const sub_categories = category?.data?.sub_categories;
    return (
        <section className="relative top-0 left-0 right-0 py-2.5 lg:py-10 w-full bg-[#FBFAFF]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-10 w-full">
                    <div className="flex flex-col flex-wrap items-center justify-center w-full">
                        <h1 className="text-2xl lg:text-4xl font-bold text-center">All PNG Image {category?.data?.name} - Free Transparent Downloads</h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                        {sub_categories?.map((sub_category: any) => (
                            <Link
                                href={`/sub-categories/${sub_category.slug}`}
                                key={sub_category.id}
                                className="group relative block w-full overflow-hidden rounded-lg shadow-lg bg-white py-2.5 px-2.5"
                            >
                                <div className="relative w-full h-64 md:h-72 overflow-hidden rounded">
                                    <Image
                                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                                        src={sub_category.icon ? `${MEDIA_URL}${sub_category.icon}` : ""}
                                        alt={sub_category.name}
                                        width={352}
                                        height={352}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-20 transition-opacity duration-700 ease-in-out group-hover:opacity-40"></div>
                                    <h4 className="absolute left-1/2 bottom-8 text-lg md:text-xl text-white font-semibold transform -translate-x-1/2 text-center">
                                        {sub_category.name}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
