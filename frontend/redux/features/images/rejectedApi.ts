/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImagesResponse } from "@/types/imagesResponse";
import { apiSlice } from "../api/apiSlice";

export const rejectedApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRejectedImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/rejected/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`
        }),
        getRejectedImagesLength: builder.query<any, void>({
            query: () => '/images/rejected-images-length/',
        }),
        getUserRejectedImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/user/rejected/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),
        getUserRejectedImagesLength: builder.query<any, void>({
            query: () => '/images/user/rejected-images-length/',
        }),
    }),
});

export const { 
    useGetRejectedImagesQuery, 
    useGetRejectedImagesLengthQuery,
    useGetUserRejectedImagesQuery,
    useGetUserRejectedImagesLengthQuery,
} = rejectedApi;
