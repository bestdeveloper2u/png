/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const cloudflareApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCloudflareConfig: builder.query<any, void>({
            query: () => '/configuration/cloudflare/config/',
        }),
        addCloudflareConfig: builder.mutation({
            query: (passwordData) => ({
                url: '/configuration/cloudflare/config/',
                method: 'POST',
                body: passwordData,
            }),
        }),
    }),
});

export const { useGetCloudflareConfigQuery, useAddCloudflareConfigMutation } = cloudflareApi;
