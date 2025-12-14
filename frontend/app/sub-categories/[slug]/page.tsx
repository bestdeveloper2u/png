/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Download } from "@/components/download/download";
import { SERVER_URL } from "@/utils/api";
import { getFetchData } from "@/utils/getFetchData";
import { siteConfig, getImageUrl } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import bgShape from "../../../public/bg-shape.jpg";
import Pagination from "@/components/pagination/pagination";

export default function SingleSubCategories() {
    const { slug } = useParams();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [subCategory, setSubCategory] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let isMounted = true;
        const fetchingData = async () => {
            try {
                const data = await getFetchData(`${SERVER_URL}/images/sub-categories/${slug}/?page=${currentPage}`, {
                    next: { revalidate: 180 },
                });
                if (!data) throw new Error(data.message || "Failed to fetch sub category");
                if (isMounted) setSubCategory(data);
            } catch (err: any) {
                if (isMounted) setError(err.message || "Something went wrong");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchingData();
        return () => { isMounted = false; };
    }, [slug, currentPage]);

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
    const subCategoryData = subCategory?.results;

    const images = subCategoryData?.images;

    const totalPages = Math.ceil(subCategory?.count / 100);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="relative top-0 left-0 right-0 py-5 lg:py-10 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-5 lg:gap-y-10 w-full">
                    <div className="flex flex-col flex-wrap justify-center items-center w-full">
                        <h1 className="text-2xl font-bold">All PNG Image {subCategoryData?.name}s - Free Transparent Downloads</h1>
                    </div>
                    <div className="flex flex-col flex-wrap w-full">
                        <>
                            {images?.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-5">
                                    {images && images.map((image: any) => {
                                        return (
                                            <div className="block w-full h-full relative rounded-2xl border border-gray-300 shadow-sm group overflow-hidden" key={image.id}>
                                                <script
                                                    type="application/ld+json"
                                                    dangerouslySetInnerHTML={{
                                                        __html: JSON.stringify({
                                                            "@context": "https://schema.org",
                                                            "@type": "ImageObject",
                                                            name: image.title,
                                                            description: image.description || image.title,
                                                            author: {
                                                                "@type": "Organization",
                                                                name: siteConfig.siteName,
                                                                url: siteConfig.url,
                                                            },
                                                            contentUrl: image.cloudflare_url,
                                                            url: getImageUrl(image.slug),
                                                            datePublished: image.created_at,
                                                            creator: {
                                                                "@type": "Organization",
                                                                name: siteConfig.siteName,
                                                            },
                                                            acquireLicensePage: siteConfig.licenseUrl,
                                                            copyrightNotice: siteConfig.copyright,
                                                            width: image.width || 352,
                                                            height: image.height || 352,
                                                            license: siteConfig.licenseUrl,
                                                            copyrightHolder: {
                                                                "@type": "Organization",
                                                                name: siteConfig.siteName,
                                                            },
                                                            exifData: image.exifData || [],
                                                        }),
                                                    }}
                                                />
                                                <Link
                                                    className="flex flex-col flex-wrap justify-center items-center w-full min-h-[200px] sm:min-h-[220px] md:min-h-[250px] lg:min-h-[350px] h-full z-50 relative overflow-hidden"
                                                    href={`/image/${image.slug}/`}
                                                >
                                                    <div
                                                        className="rounded-2xl bg-center bg-no-repeat bg-cover opacity-0 absolute top-0 right-0 left-0 w-full h-full group-hover:opacity-100 transition-all duration-300 ease-in-out"
                                                        style={{ backgroundImage: `url(${bgShape.src})` }}
                                                    ></div>
                                                    <div className="flex flex-col flex-wrap justify-center items-center z-50">
                                                        <Image
                                                            className="w-auto h-auto object-fill"
                                                            src={image.cloudflare_url}
                                                            alt={image.title}
                                                            title={image.title}
                                                            content={image.description}
                                                            width={352}
                                                            height={352}
                                                        />
                                                    </div>
                                                    {image.title && (
                                                        <div
                                                            className="absolute bottom-0 right-0 left-0 w-full px-2.5 py-2.5 text-white/80 text-sm bg-black/80 z-50 rounded-b-2xl translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out"
                                                        >
                                                            <p className="text-sm font-normal text-center line-clamp-3">{image.title}</p>
                                                        </div>
                                                    )}
                                                </Link>
                                                <Download
                                                    imageId={image.cloudflare_id}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-[calc(100vh-280px)] w-full">
                                    <p className="text-2xl text-gray-600 font-medium">No found images...</p>
                                </div>
                            )}
                            <div className="flex flex-col flex-wrap justify-center items-center mt-2.5 lg:mt-5 w-full">
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </section>
    );
}
