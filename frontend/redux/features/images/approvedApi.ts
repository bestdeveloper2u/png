/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImagesResponse } from '@/types/imagesResponse';
import { apiSlice } from '../api/apiSlice';

export const approvedApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getApprovedImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/approved/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),

        getApprovedImagesLength: builder.query<any, void>({
            query: () => '/images/approved-images-length/',
        }),

        getUserApprovedImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/user/approved/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),
        
        getUserApprovedImagesLength: builder.query<any, void>({
            query: () => '/images/user/approved-images-length/',
        }),
    }),
});

export const {
    useGetApprovedImagesLengthQuery,
    useGetApprovedImagesQuery,
    useGetUserApprovedImagesQuery,
    useGetUserApprovedImagesLengthQuery,
} = approvedApi;
