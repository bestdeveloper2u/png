import { apiSlice } from "../api/apiSlice";

export const imageUploadApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        imageUpload: builder.mutation({
            query: (data) => ({
                url: "/images/upload/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useImageUploadMutation } = imageUploadApi;
