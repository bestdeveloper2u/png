/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactIcons } from "@/utils/reactIcons";
import React from "react";
import { KeywordList } from "./keywordlist";
import { Dimensions } from "./dimensions";
import { Download } from "./download";
import { FileSize } from "./filesize";
import { SocialMedia } from "./socialmedia";

interface MainImageProps {
    image: any;
    pageUrl: string;
}

export const Content: React.FC<MainImageProps> = ({ image, pageUrl }) => {
    const { IoInformationCircleOutline, AiOutlineFileText, PiImageSquareLight } = ReactIcons;

    return (
        <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-2.5 w-full">
            {/* IMAGE TITLE */}
            {image?.image?.title && <div className="flex flex-col flex-wrap border border-gray-300 rounded px-2.5 py-2.5 w-full order-2 md:order-1">
                <h1 className="text-black/80 text-lg font-medium">{image?.image?.title}</h1>
            </div>}

            {/* IMAGE DESCRIPTION & KEYWORDS */}
            <div className="flex flex-col flex-wrap gap-y-2.5 order-3 md:order-2">
                <p className="text-sm">{image?.image?.description}</p>
                <KeywordList image={image} />
            </div>

            <div className="flex flex-col flex-wrap gap-y-1.5 w-full order-4 md:order-3">
                {/* PNG Info */}
                <div className="flex flex-row flex-wrap items-center py-1.5 px-1.5 gap-x-2.5 rounded w-full border border-gray-300 shadow-sm">
                    <IoInformationCircleOutline className="text-2xl md:text-3xl" />
                    <span className="text-sm font-normal">PNG Info</span>
                </div>

                {/* Dimensions */}
                <div className="flex flex-row flex-wrap items-center justify-between py-1.5 px-1.5 gap-x-2.5 rounded w-full border border-gray-300 shadow-sm">
                    <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                        <AiOutlineFileText className="text-2xl md:text-3xl" />
                        <span className="text-sm font-normal">Dimensions</span>
                    </div>
                    <Dimensions image={image} />
                </div>

                {/* File Size */}
                <div className="flex flex-row flex-wrap items-center justify-between py-1.5 px-1.5 gap-x-2.5 rounded w-full border border-gray-300 shadow-sm">
                    <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                        <AiOutlineFileText className="text-2xl md:text-3xl" />
                        <span className="text-sm font-normal">File Size</span>
                    </div>
                    <FileSize image={image} />
                </div>

                {/* MIME Type (hardcoded PNG for now) */}
                <div className="flex flex-row flex-wrap items-center justify-between py-1.5 px-1.5 gap-x-2.5 rounded w-full border border-gray-300 shadow-sm">
                    <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                        <PiImageSquareLight className="text-2xl md:text-3xl" />
                        <span className="text-sm font-normal">MIME Type</span>
                    </div>
                    <div>
                        <span className="text-sm font-normal">image/png</span>
                    </div>
                </div>
            </div>

            {/* IMAGE DOWNLOADING */}
            <Download image={image} />

            {/* SOCIAL MEDIA IMAGE SHARING */}
            <SocialMedia image={image} pageUrl={pageUrl} />

        </div>
    );
}
