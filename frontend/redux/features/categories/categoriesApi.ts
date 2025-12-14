import { apiSlice } from "../api/apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCategory: builder.mutation({
            query: (formData) => ({
                url: '/images/categories/',
                method: 'POST',
                body: formData,
            }),
        }),

        getCategories: builder.query({
            query: (search?: string) => {
                const params = search ? `?name=${encodeURIComponent(search)}` : '';
                return `/images/categories/${params}`;
            },
        }),
        getSingleCategories: builder.query({
            query: (id) => `/images/categories/${id}/`
        }),

        updateCategory: builder.mutation({
            query: ({ id, formData }: { id: number; formData: FormData }) => ({
                url: `/images/categories/${id}/`,
                method: 'PUT',
                body: formData,
            }),
        }),
        partialUpdateCategory: builder.mutation({
            query: ({ id, formData }: { id: number; formData: FormData }) => ({
                url: `/images/categories/${id}/`,
                method: 'PATCH',
                body: formData,
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id: number) => ({
                url: `/images/categories/${id}/`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    usePartialUpdateCategoryMutation,
    useUpdateCategoryMutation,

    useGetCategoriesQuery,
    useGetSingleCategoriesQuery,
} = categoriesApi;
