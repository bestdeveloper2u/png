import { apiSlice } from "../api/apiSlice";

export const csvApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCSVUpload: builder.mutation({
            query: (data) => ({
                url: "/images/upload/csv/",
                method: "POST",
                body: data,
            }),
        })
    }),
});

export const { useAddCSVUploadMutation } = csvApi;
