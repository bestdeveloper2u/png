import { SERVER_URL } from "@/utils/api";
import { ReactIcons } from "@/utils/reactIcons";
import React from "react";

type DownloadProps = {
    imageId: number;
}

export const Download: React.FC<DownloadProps> = ({ imageId }) => {
    const { HiOutlineDownload } = ReactIcons;

    const handleDownloadImage = (imageId: string) => {
        const url = `${SERVER_URL}/images/download/${imageId}/`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <button
            className="absolute top-2 right-2 text-white bg-blue-500 py-2.5 px-2.5 rounded cursor-pointer z-[9999] scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-400 ease-in-out"
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownloadImage(imageId.toString());
            }}
        >
            <HiOutlineDownload className="text-2xl" />
        </button>
    );
}
