import { apiSlice } from "../api/apiSlice";

export const download = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDownload: builder.query({
      query: () => `/images/download/`,
    }),
    getAllDownload: builder.query({
      query: () => '/images/all-download/',
    }),
    getAllContributorDownload: builder.query({
      query: () => '/images/all-contributor-download/',
    }),
  }),
});

export const { useGetDownloadQuery, useGetAllDownloadQuery, useGetAllContributorDownloadQuery } = download;
