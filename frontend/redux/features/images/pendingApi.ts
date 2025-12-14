/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImagesResponse } from '@/types/imagesResponse';
import { apiSlice } from '../api/apiSlice';

export const pendingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPendingImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/pending/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),
        getPendingImagesLength: builder.query<any, void>({
            query: () => '/images/pending-images-length/',
        }),
        getUserPendingImages: builder.query<{ images: ImagesResponse[]; count: number }, { searchTerm: string; pageNumber: number }>({
            query: ({ searchTerm, pageNumber }) => `/images/user/pending/?title=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        }),
        getUserPendingImagesLength: builder.query<any, void>({
            query: () => '/images/user/pending-images-length/',
        }),
        NumberOfImagesUpdate: builder.mutation({
            query: (data) => ({
                url: '/images/update-multiple/',
                method: 'PATCH',
                body: data,
            }),
        }),
        NumberOfImagesDelete: builder.mutation({
            query: (data) => ({
                url: '/images/deletes/',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetPendingImagesLengthQuery,
    useGetPendingImagesQuery,
    useGetUserPendingImagesQuery,
    useGetUserPendingImagesLengthQuery,
    useNumberOfImagesDeleteMutation,
    useNumberOfImagesUpdateMutation,
} = pendingApi;
