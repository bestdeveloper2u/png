import { apiSlice } from "../api/apiSlice";

export const subCategoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addSubCategory: builder.mutation({
            query: (formData) => ({
                url: '/images/sub-categories/',
                method: 'POST',
                body: formData,
            }),
        }),

        getSubCategories: builder.query({
            query: (search?: string) => {
                const params = search ? `?name=${encodeURIComponent(search)}` : '';
                return `/images/sub-categories/${params}`;
            },
        }),
        getSingleSubCategories: builder.query({
            query: (id) => `/images/sub-categories/${id}/`,
        }),
        updateSubCategory: builder.mutation({
            query: ({ id, formData }: { id: number; formData: FormData }) => ({
                url: `/images/sub-categories/${id}/`,
                method: 'PUT',
                body: formData,
            }),
        }),
        partialUpdateSubCategory: builder.mutation({
            query: ({ id, formData }: { id: number; formData: FormData }) => ({
                url: `/images/sub-categories/${id}/`,
                method: 'PATCH',
                body: formData,
            }),
        }),
        deleteSubCategory: builder.mutation({
            query: (id: number) => ({
                url: `/images/sub-categories/${id}/`,
                method: 'DELETE',
            }),
        }),

    }),
});

export const {
    useAddSubCategoryMutation,
    useDeleteSubCategoryMutation,
    usePartialUpdateSubCategoryMutation,
    useUpdateSubCategoryMutation,

    useGetSubCategoriesQuery,
    useGetSingleSubCategoriesQuery,
} = subCategoriesApi;
