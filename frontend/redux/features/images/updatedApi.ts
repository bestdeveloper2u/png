import { apiSlice } from '../api/apiSlice';

export const ImageUpdatedApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updatedImage: builder.mutation({
            query: ({ id, data }) => ({
                url: `/images/update/${id}/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            }),
        }),
        bulkImageUpdate: builder.mutation({
            query: (data) => ({
                url: `/images/bulk-update/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            }),
        }),
    }),
});

export const { useUpdatedImageMutation, useBulkImageUpdateMutation } = ImageUpdatedApi;
