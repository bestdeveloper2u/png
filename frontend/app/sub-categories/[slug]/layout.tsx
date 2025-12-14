/* eslint-disable @typescript-eslint/no-explicit-any */
import { SERVER_URL } from "@/utils/api";
import { getSubCategoryUrl } from "@/config/site";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await fetch(`${SERVER_URL}/images/sub-categories/${slug}/`, {
            next: { revalidate: 120 },
        });

        if (!res.ok) {
            return {
                title: "PNGPoint",
                description: "PNGPoint image details",
                alternates: { canonical: getSubCategoryUrl(slug) },
            };
        }

        const SingleSubCategoryResdata = await res.json();
        const data = SingleSubCategoryResdata?.data;

        return {
            title: `Browse All PNG Image ${data.name} | Free Transparent PNGs | PNGPoint`,
            description: "Discover our full collection of PNG images, neatly organized by category for quick and easy downloads.",
            alternates: {
                canonical: getSubCategoryUrl(slug),
            },
        };

    } catch (error: any) {
        console.log(error.message);
        return {
            title: "PNGPoint",
            description: "PNGPoint image details",
            alternates: { canonical: getSubCategoryUrl(slug) },
        };
    }
}

export default function SingleSubCategoryRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="relative top-0 left-0 right-0 w-full">
            {children}
        </section>
    );
}
