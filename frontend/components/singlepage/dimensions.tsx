/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

interface ImageProps {
    image: any;
}

export const Dimensions: React.FC<ImageProps> = ({ image }) => {
    const [dimensions, setDimensions] = useState<{ width: number, height: number } | null>(null);

    useEffect(() => {
        if (!image?.image?.cloudflare_url) return;

        const img = new window.Image();
        img.src = image.image.cloudflare_url;
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
    }, [image?.image?.cloudflare_url]);

    return (
        <div>
            <span className="text-sm font-normal">{dimensions ? `${dimensions.width} × ${dimensions.height}` : "Loading..."}</span>
        </div>
    );
}
