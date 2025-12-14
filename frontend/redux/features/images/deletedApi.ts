import { apiSlice } from '../api/apiSlice';

export const imageDeletedApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // numberOfImageDelet: builder.mutation<void, number[] | number>({
        //     query: (ids) => {
        //         const idsParam = Array.isArray(ids) ? ids.join(',') : ids;
        //         return {
        //             url: `/images/delete/?image_ids=${idsParam}`,
        //             method: 'DELETE',
        //         };
        //     },
        // }),
        singleImageDelete: builder.mutation<void, number>({
            query: (imgID) => ({
                url: `/images/delete/${imgID}/`,
                method: 'DELETE',
            }),
        }),
        allImageDelete: builder.mutation<void, void>({
            query: () => ({
                url: '/images/deleted-all/',
                method: 'DELETE',
            }),
        }),
    }),
});

export const { 
    // useNumberOfImageDeletMutation, 
    useSingleImageDeleteMutation, 
    useAllImageDeleteMutation,
} = imageDeletedApi;
