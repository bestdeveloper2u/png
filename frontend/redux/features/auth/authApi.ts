/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginResponseType } from "@/types/loginResponseType";
import { apiSlice } from "../api/apiSlice";
import { setAuth } from "./authSlice";

export interface LoginPropsType {
    email: string;
    password: string;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addLogin: builder.mutation<LoginResponseType, LoginPropsType>({
            query: (data) => ({
                url: "/accounts/user/login/",
                method: "POST",
                body: data,
            }),
            async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const authData = {
                        user: data.data.user,
                        tokens: {
                            access_token: data.data.tokens.access_token,
                            refresh_token: data.data.tokens.refresh_token,
                        },
                    };
                    dispatch(setAuth(authData));
                } catch (err: any) {
                    const errorMsg = err?.error?.data?.message || "Login failed!";
                    console.error("Login time error:", errorMsg);
                }
            },
        }),
        addRegister: builder.mutation({
            query: (data) => ({
                url: '/accounts/user/register/',
                method: 'POST',
                body: data,
            }),
        }),
        addProfileChange: builder.mutation({
            query: (passwordData) => ({
                url: '/accounts/user/profile/update/',
                method: 'PATCH',
                body: passwordData,
            }),
        }),
        getUser: builder.query<any, void>({
            query: () => '/accounts/user/profile/',
        }),
        addChangePassword: builder.mutation({
            query: (passwordData) => ({
                url: '/accounts/user/password/change/',
                method: 'POST',
                body: passwordData,
            }),
        }),
        addForgotPasswordEmail: builder.mutation({
            query: (data) => ({
                url: '/accounts/user/forgot-password/',
                method: 'POST',
                body: data,
            }),
        }),
        addConfirmPassword: builder.mutation({
            query: ({ data, uidb64, token }) => ({
                url: `/accounts/user/reset-password/${uidb64}/${token}/`,
                method: "POST",
                body: data,
            }),
        }),
        addUsers: builder.query({
            query: () => '/accounts/users-list/',
        }),
        addAdminProfileChange: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/accounts/user/admin/update/${id}/`,
                method: 'PATCH',
                body: data,
            }),
        }),
        getUserDownloadCount: builder.query({
            query: () => '/accounts/user/download-count/',
        }),
    }),
});

export const {
    useAddLoginMutation,
    useAddRegisterMutation,
    useAddProfileChangeMutation,
    useGetUserQuery,
    useAddChangePasswordMutation,
    useAddForgotPasswordEmailMutation,
    useAddConfirmPasswordMutation,
    useAddUsersQuery,
    useAddAdminProfileChangeMutation,
    useGetUserDownloadCountQuery,
} = authApi;
