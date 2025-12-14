/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/components/footer/footer";
import { SingleImageHeader } from "@/components/header/single_image_header";
import { SERVER_URL } from "@/utils/api";
import { getImageUrl } from "@/config/site";
import { Metadata } from "next";
import React from "react";

type GenerateMetadataProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
    const { slug } = await params; 
    try {
        const res = await fetch(`${SERVER_URL}/images/${slug}/`, {
            next: { revalidate: 120 },
        });

        if (!res.ok) {
            return {
                title: "Image - PNGPoint",
                description: "PNGPoint image details",
                alternates: { canonical: getImageUrl(slug) },
            };
        }

        const imageResdata = await res.json();
        const data = imageResdata?.image;

        const imageUrl = data.cloudflare_url;

        return {
            title: `${data.title || "Image"} - PNGPoint`,
            description: data.description || "High-quality PNG image from PNGPoint",
            alternates: { canonical: getImageUrl(slug) },
            openGraph: {
                title: `${data.title || "Image"} - PNGPoint`,
                description: data.description || "High-quality PNG image from PNGPoint",
                url: getImageUrl(slug),
                type: "website",
                images: [
                    {
                        url: imageUrl,
                        width: data.width || 450,
                        height: data.height || 300,
                        alt: data.title || "PNGPoint Image",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: data.title || "Image - PNGPoint",
                description: data.description || "High-quality PNG image from PNGPoint",
                images: [imageUrl],
            },
        };
    } catch (error: any) {
        console.error(error.message);
        return {
            title: "Image - PNGPoint",
            description: "PNGPoint image details",
            alternates: { canonical: getImageUrl(slug) },
        };
    }
}

export default function ImageRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="relative top-0 left-0 right-0 w-full">
            <SingleImageHeader />
            {children}
            <Footer />
        </section>
    );
}
