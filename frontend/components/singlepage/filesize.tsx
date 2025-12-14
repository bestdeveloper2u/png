/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

interface ImageProps {
    image: any;
}

export const FileSize:React.FC<ImageProps> = ({ image }) => {
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

    return (
        <div>
            <span className="text-sm font-normal">{formatFileSize(fileSize)}</span>
        </div>
    );
};
