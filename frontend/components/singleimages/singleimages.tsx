/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getFetchData } from "@/utils/getFetchData";
import { SERVER_URL } from "@/utils/api";

import { MainImage } from "../singlepage/mainimage";
import { Content } from "../singlepage/content";
import { RelatedImages } from "../relatedImages/related_images";

interface SingleImagesProps {
    image: any;
    pageUrl: string;
    slug: string;
}

export const SingleImages: React.FC<SingleImagesProps> = ({ image, pageUrl, slug }) => {
    const { title, keyword } = useSelector((state: RootState) => state.search);

    const [singleImageData, setSingleImageData] = useState<any>(image);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchSingleImage = async () => {
            try {
                // Build query params dynamically
                const params = new URLSearchParams();
                if (title) params.append("search", title);
                if (keyword) params.append("keyword", keyword);

                const queryString = params.toString();
                const url = `${SERVER_URL}/images/${slug}/${queryString ? `?${queryString}` : ""}`;

                console.log("Fetching:", url);
                const res = await getFetchData(url);
                setSingleImageData(res);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            // Only re-fetch when title/keyword changes
            if (title || keyword) fetchSingleImage();
        }
    }, [title, keyword]);

    return (
        <>
            {singleImageData?.image && (
                <div className="grid grid-cols-1 md:grid-cols-[60%_35%] lg:grid-cols-[60%_35%] xl:grid-cols-[57%_40%] gap-5 lg:gap-10">
                    <MainImage image={singleImageData} />
                    <Content image={singleImageData} pageUrl={pageUrl} />
                </div>
            )}
            <div className="block w-full mt-5 md:mt-8">
                <RelatedImages images={singleImageData?.results} />
            </div>
        </>
    );
};
