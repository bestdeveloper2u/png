"use client";

import { setKeyword } from "@/redux/features/getImages/getImageSlice";
import React from "react";
import { useDispatch } from "react-redux";

const Tags = [
    {
        id: 1,
        name: 'angel png',
        slug: 'angel-png'
    },
    {
        id: 2,
        name: 'amantran png',
        slug: 'amantran-png'
    },
    {
        id: 3,
        name: 'arrow png download',
        slug: 'arrow-png-download'
    },
    {
        id: 4,
        name: 'aesthetic stickers png',
        slug: 'aesthetic-stickers-png'
    },
    {
        id: 5,
        name: 'background islami png',
        slug: 'background-islami-png'
    },
    {
        id: 6,
        name: 'balloon png images',
        slug: 'balloon-png-images'
    },
    {
        id: 7,
        name: 'birthday frame png',
        slug: 'birthday-frame-png'
    },
    {
        id: 8,
        name: 'birthday png background',
        slug: 'birthday-png-background'
    },
    {
        id: 9,
        name: 'black smoke png',
        slug: 'black-smoke-png'
    },
    {
        id: 10,
        name: 'broken heart png',
        slug: 'broken-heart-png'
    },
    {
        id: 11,
        name: 'butterfly png image',
        slug: 'butterfly-png-image'
    },
    {
        id: 12,
        name: 'bubble png transparent',
        slug: 'bubble-png-transparent'
    },
    {
        id: 13,
        name: 'bismillahir rahmanir rahim png',
        slug: 'bismillahir-rahmanir-rahim-png'
    },
    {
        id: 14,
        name: 'coming soon png',
        slug: 'coming-soon-png'
    },
    {
        id: 15,
        name: 'emoji png download',
        slug: 'emoji-png-download'
    },
    {
        id: 16,
        name: 'grand opening png',
        slug: 'grand-opening-png'
    },
    {
        id: 17,
        name: 'iphone mockup png',
        slug: 'iphone-mockup-png'
    },
    {
        id: 18,
        name: 'logo gratis download',
        slug: 'logo-gratis-download'
    },
    {
        id: 19,
        name: 'milk splash png',
        slug: 'milk-splash-png'
    },
    {
        id: 20,
        name: 'smoke png transparent',
        slug: 'smoke-png-transparent'
    },
    {
        id: 21,
        name: 'tshirt mockup png',
        slug: 'tshirt-mockup-png'
    },
];

export const Trendingtags: React.FC = () => {
    const dispatch = useDispatch();
    const handleTagClick = (keyword: string) => {
        dispatch(setKeyword(keyword));
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const tags = Tags;

    return (
        <>
            <section className="relative top-0 left-0 right-0 py-5 w-full bg-white">
                <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
                    <div className="flex flex-col flex-wrap gap-y-2.5 md:gap-y-4 w-full">
                        <h4 className="text-black/80 text-sm md:text-base font-semibold text-center capitalize">
                            Trending Tags Today
                        </h4>
                        <div className="flex flex-row flex-wrap items-center justify-center w-full gap-1.5 md:gap-2.5">
                            {tags.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleTagClick(item.slug)}
                                    className="py-1 md:py-1.5 px-2.5 md:px-4 rounded bg-[#e8eaf0] cursor-pointer"
                                >
                                    <span className="text-xs md:text-sm font-medium">
                                        {item.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
