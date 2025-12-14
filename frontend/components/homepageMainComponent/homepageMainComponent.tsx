/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getFetchData } from "@/utils/getFetchData";
import { SERVER_URL } from "@/utils/api";

import Footer from "../footer/footer";
import { Header } from "../header/header";
import { SearchingImage } from "../searchingImage/searchingImage";
import { Trendingimages } from "../trendingimages/trendingimages";
import { Trendingtags } from "../trendingtags/trendingtags";
import { setSearch } from "@/redux/features/getImages/getImageSlice";
import { TrendingImagesPagination } from "../trendingimages/trendingImagesPagination";

interface ImagesData {
    count: number;
    images: any[];
}

export const HomepageMainComponent = ({ initialImagesData }: { initialImagesData: ImagesData }) => {
    const [imagesData, setImagesData] = useState<ImagesData>(initialImagesData);
    const search = useSelector((state: RootState) => state.search);

    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isFirstRender = useRef(true);

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());

        const payload = {
            title: params.title ?? "",
            category: params.category ?? "",
            keyword: params.keyword ?? "",
            page: params.page ? Number(params.page) : 1,
        };

        dispatch(setSearch(payload));
    }, [searchParams, dispatch]);

    useEffect(() => {
        const fetchImages = async () => {
            const { title, category, keyword, page } = search;

            const queryParams = Object.entries({ title, category, keyword, page })
                .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== 1)
                .map(([key, value]) => {
                    if (key === "keyword" && typeof value === "string") {
                        const slugValue = value.trim().replace(/\s+/g, "-").toLowerCase();
                        return `${encodeURIComponent(key)}=${encodeURIComponent(slugValue)}`;
                    }
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                })
                .join("&");

            const nextPath = queryParams ? `/?${queryParams}` : "/";
            router.push(nextPath, { scroll: false });

            const url = `${SERVER_URL}/images/approved/${queryParams ? `?${queryParams}` : ""}`;
            try {
                const data = await getFetchData(url, { next: { revalidate: 120 } });
                setImagesData(data);
            } catch (error) {
                console.error("Failed to fetch images", error);
            }
        };

        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            fetchImages();
        }
    }, [search, router]);

    return (
        <>
            <Header />
            <SearchingImage />
            <Trendingimages imagesData={imagesData.images} />
            {imagesData?.count > 100 && (
                <TrendingImagesPagination count={imagesData?.count} />
            )}
            <Trendingtags />
            <Footer />
        </>
    );
};
