"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import React from "react";
import bgShape from "../../public/bg-shape.jpg";
import { Download } from "../download/download";
import { siteConfig, getImageUrl } from "@/config/site";

interface ImagesProps {
    images: any;
}

export const RelatedImages: React.FC<ImagesProps> = ({ images }) => {

    const handleRelatedImageClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <section className="relative top-0 left-0 right-0 py-5 w-full bg-[#FBFAFF]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-5 w-full">
                    <h2 className="text-base md:text-2xl font-semibold text-center uppercase">below are more related png files</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 basis-full">
                        {images?.map((image: any) => {
                            return (
                                <div className="block w-full h-full relative rounded-2xl border border-gray-300 shadow-sm group" key={image.id} onClick={() => handleRelatedImageClick()}>
                                    <Link
                                        className="flex flex-col flex-wrap justify-center items-center w-full min-h-[200px] sm:min-h-[220px] md:min-h-[250px] lg:min-h-[350px] h-full z-50 relative overflow-hidden"
                                        href={`/image/${image.slug}/`}
                                    >
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
                                                        datePublished: new Date(image.created_at).toLocaleString("en-US", {
                                                            timeZone: "Asia/Dhaka",
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                        }),
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
                                            
                                        <div className="rounded-2xl bg-center bg-no-repeat bg-cover opacity-0 absolute top-0 right-0 left-0 w-full h-full group-hover:opacity-100 transition-all duration-300 ease-in-out" style={{ backgroundImage: `url(${bgShape.src})` }}></div>
                                        <div className="flex flex-col flex-wrap justify-center items-center z-50">
                                            <Image
                                                className="w-auto h-auto"
                                                src={image.cloudflare_url}
                                                alt={image.title}
                                                title={image.title}
                                                content={image.description}
                                                width={352}
                                                height={352}
                                            />
                                        </div>
                                        <div
                                            className="absolute bottom-0 right-0 left-0 w-full px-2.5 py-2.5 text-white/80 text-sm bg-black/80 z-50 rounded-b-2xl translate-y-full group-hover:translate-y-0 transition-all duration-400 ease-in-out"
                                        >
                                            <p className="text-sm font-normal text-center line-clamp-3">{image.title}</p>
                                        </div>
                                    </Link>
                                    <Download imageId={image.cloudflare_id} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
