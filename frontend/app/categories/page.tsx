/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MEDIA_URL, SERVER_URL } from "@/utils/api";

export default function Categories() {
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${SERVER_URL}/images/categories/`)
            .then(res => res.json())
            .then(data => setCategoriesData(data.data || []))
            .catch(err => console.error("Failed to fetch categories:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center py-10">Loading categories...</p>;

    return (
        <section className="relative top-0 left-0 rigth-0 py-5 lg:py-10 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-5 lg:gap-y-10 w-full">
                    <div className="flex flex-col flex-wrap justify-center items-center gap-y-6 text-center w-full">
                        <h1 className="text-2xl lg:text-4xl font-bold text-[#0077a2]">
                            All PNG Image Categories - Free Transparent Downloads
                        </h1>
                        <div className="flex flex-col flex-wrap gap-y-1">
                            <h4 className="text-xl lg:text-2xl font-bold">
                                Popular PNG Categories for Every Design Project
                            </h4>
                            <p className="text-sm md:text-base font-normal">
                                Discover our full collection of PNG images <br />
                                neatly organized by category for quick and easy downloads.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                        {categoriesData.map(category => (
                            <Link
                                className="group relative block w-full overflow-hidden rounded-lg shadow-lg bg-white py-2.5 px-2.5"
                                href={`/categories/${category.slug}/`}
                                key={category.id}
                            >
                                <div className="relative w-full h-64 md:h-90 overflow-hidden rounded">
                                    <Image
                                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                                        src={category.icon ? `${MEDIA_URL}${category.icon}` : ""}
                                        alt={category.name}
                                        width={352}
                                        height={352}
                                        title={category.name}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-20 transition-opacity duration-700 ease-in-out group-hover:opacity-40"></div>
                                    <h4 className="absolute left-1/2 bottom-8 text-lg md:text-xl text-white font-semibold transform -translate-x-1/2 text-center">
                                        {category.name}
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
