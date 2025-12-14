/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setKeyword } from "@/redux/features/getImages/getImageSlice";
import React from "react";
import { useDispatch } from "react-redux";

interface ImageProps {
    image: any;
}

export const KeywordList: React.FC<ImageProps> = ({ image }) => {
    const dispatch = useDispatch();

    const handleTagClick = (keyword: string) => {
        dispatch(setKeyword(keyword));
    };

    return (
        <div className="flex flex-row flex-wrap items-center gap-1.5">
            {image?.image?.keywords?.map((item: any) => {
                return (
                    <button className="bg-[#eaeaea] text-black/80 rounded py-1.5 px-1.5 cursor-pointer" key={item.id} onClick={() => handleTagClick(item.slug)} type="button">
                        <span className="text-xs">{item.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
