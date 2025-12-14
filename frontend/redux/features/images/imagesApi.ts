/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const images = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<any, Record<string, string | number | undefined>>({
      
      
      query: (params) => {
        const filteredParams: Record<string, string> = {};
        for (const key in params) {
          const value = params[key];
          if (value !== undefined && value !== null && value !== "") {
            filteredParams[key] = String(value);
          }
        }
        const query = new URLSearchParams(filteredParams).toString();
        return `/images/approved/?${query}`;
      },


    }),
  }),
});

export const { useGetImagesQuery } = images;
