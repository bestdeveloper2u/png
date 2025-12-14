import { apiSlice } from "../api/apiSlice";

type Keyword = {
  id: number;
  name: string;
  slug: string;
  image: number;
};

type KeywordResponse = {
  success: boolean;
  message: string;
  data: Keyword[];
};

export const keywords = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKeywords: builder.query<KeywordResponse, void>({
      query: () => "/images/keywords/",
    }),
  }),
});

export const { useGetKeywordsQuery } = keywords;
