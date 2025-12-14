/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";
import bgShape from "../../public/bg-shape.jpg";
import { siteConfig, getImageUrl } from "@/config/site";

interface MainImageProps {
    image: any;
}

export const MainImage: React.FC<MainImageProps> = ({ image }) => {
    return (
        <div className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-5 w-full h-full">
            <div className="relative rounded-2xl border border-gray-300 cursor-pointer shadow-md group h-full">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ImageObject",
                            name: image?.image?.title,
                            description: image?.image?.description || image?.image?.title,
                            author: {
                                "@type": "Organization",
                                name: siteConfig.siteName,
                                url: siteConfig.url,
                            },
                            contentUrl: image?.image?.cloudflare_url,
                            url: getImageUrl(image?.image?.slug),
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
                <div className="flex flex-col flex-wrap justify-center items-center w-full h-full z-50 relative overflow-hidden">
                    <div className="rounded-2xl bg-center bg-no-repeat bg-cover opacity-0 absolute top-0 right-0 left-0 w-full h-full group-hover:opacity-100 transition-all duration-300 ease-in-out" style={{ backgroundImage: `url(${bgShape.src})` }}></div>
                    <div className="flex flex-col flex-wrap justify-center items-center p-2.5 z-50">
                        <Image
                            className="w-auto h-auto max-h-[350px] md:max-h-[600px]"
                            src={image?.image?.main_url}
                            alt={image?.image?.title}
                            title={image?.image?.title}
                            content={image?.image?.description}
                            width={500}
                            height={600}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
