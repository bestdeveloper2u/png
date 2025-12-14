/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SERVER_URL } from "@/utils/api";
import { ReactIcons } from "@/utils/reactIcons";
import React, { useEffect, useState } from "react";

interface ImageProps {
    image: any;
}

export const Download: React.FC<ImageProps> = ({ image }) => {
    const { HiOutlineDownload } = ReactIcons;
    const [fileSize, setFileSize] = useState<number | null>(null);

    useEffect(() => {
        if (!image?.image?.cloudflare_url) return;

        const img = new window.Image();
        img.src = image.image.cloudflare_url;

        fetch(image.image.cloudflare_url, { method: "HEAD" })
            .then(res => {
                const length = res.headers.get("Content-Length");
                if (length) setFileSize(parseInt(length, 10));
            })
            .catch(err => console.error("Failed to fetch file size", err));
    }, [image?.image?.cloudflare_url]);

    const formatFileSize = (bytes: number | null) => {
        if (bytes === null) return "--";
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
        else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleDownloadImage = (id: string) => {
        const url = `${SERVER_URL}/images/download/${id}/`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            {fileSize && (
                <button className="flex flex-row flex-wrap items-center gap-x-2.5 w-fit py-3 px-4 md:px-5 cursor-pointer text-sm md:text-base text-white bg-[#0077A2] rounded order-1 md:order-4" type="button" onClick={() => handleDownloadImage(image?.image?.cloudflare_id)}>
                    <HiOutlineDownload className="text-xl md:text-2xl" />
                    <span>Free Download ({formatFileSize(fileSize)})</span>
                </button>
            )}
        </>
    );
}
