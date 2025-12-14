/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactIcons } from "@/utils/reactIcons";
import Link from "next/link";
import React from "react";

interface ImageProps {
    image: any;
    pageUrl: string;
}

export const SocialMedia: React.FC<ImageProps> = ({ image, pageUrl }) => {
    const { FaFacebook, FaPinterest, FaXTwitter, FaInstagram } = ReactIcons;

    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(image?.image?.title || "");
    const encodedMedia = encodeURIComponent(image?.image?.cloudflare_url || "");

    return (
        <div className="flex flex-row flex-wrap items-center gap-x-5 lg:gap-x-10 order-5">
            <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-[#1877F2] rounded-full p-1.5"
            >
                <FaFacebook className="text-2xl" />
            </Link>
            <Link
                href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedMedia}&description=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111111] text-white rounded-full p-1.5"
            >
                <FaPinterest className="text-2xl" />
            </Link>
            <Link
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1da1f2] text-white rounded-full p-1.5"
            >
                <FaXTwitter className="text-2xl" />
            </Link>
            <Link
                href={`https://www.instagram.com/pngpoint/`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E1306C] text-white rounded-full p-1.5"
            >
                <FaInstagram className="text-2xl" />
            </Link>
        </div>
    );
};
