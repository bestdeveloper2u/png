/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImagesResponse } from '@/types/imagesResponse';
import { apiSlice } from '../api/apiSlice';

export const totalApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        getTotalImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/total/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),
        getTotalImagesLength: builder.query<any, void>({
            query: () => '/images/total-images-length/',
        }),
        
        getUserTotalImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/user/total/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),

        getUserTotalImagesLength: builder.query<any, void>({
            query: () => '/images/user/total-images-length/',
        }),
    }),
});

export const { 
    useGetTotalImagesLengthQuery, 
    useGetTotalImagesQuery,
    useGetUserTotalImagesQuery,
    useGetUserTotalImagesLengthQuery,
} = totalApi;
