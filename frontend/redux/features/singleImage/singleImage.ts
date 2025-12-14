/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const singleImage = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSingleImage: builder.query<any, Record<string, any>>({
      query: (params) => {
        const { slug, ...rest } = params;
        const filteredParams: Record<string, string> = {};
        for (const key in rest) {
          const value = rest[key];
          if (value !== undefined && value !== null && value !== "") {
            filteredParams[key] = String(value);
          }
        }
        const query = new URLSearchParams(filteredParams).toString();
        return `/images/${slug}/?${query}`;
      },
    }),
  }),
});

export const { useGetSingleImageQuery } = singleImage;
