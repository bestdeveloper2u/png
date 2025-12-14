/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import bgShape from "../../public/bg-shape.jpg";
import { Download } from "../download/download";
import { siteConfig, getImageUrl } from "@/config/site";

type TrendingimagesProps = {
    imagesData: any;
};

export const Trendingimages: React.FC<TrendingimagesProps> = ({ imagesData }) => {
    const images = imagesData;
    return (
        <section className="relative top-0 left-0 right-0 py-5 w-full bg-[#FBFAFF]">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                <div className="flex flex-col flex-wrap gap-y-5 w-full">
                    <h2 className="text-lg md:text-2xl font-semibold text-center uppercase">Trending images for designers</h2>
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
                                                        
                                                        creditText: siteConfig.siteName,
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
                            <div className="flex flex-col flex-wrap justify-center items-center py-5 md:py-10 w-full">
                                <p>No images found</p>
                            </div>
                        )}
                    </>
                </div>
            </div>
        </section>
    );
}
