/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, type FetchArgs } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";
import { logout, setAuth } from "../auth/authSlice";
import { SERVER_URL } from "@/utils/api";

const AUTH_STORAGE_KEY = "auth";

const clearSessionAuth = () => {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
};

const baseQuery = fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers, api) => {
        const token = (api.getState() as RootState).auth?.tokens?.access_token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const verifyAccessToken = async (
    accessToken: string,
    api: any,
    extraOptions: any
): Promise<boolean> => {
    const result = await baseQuery(
        {
            url: "/token/verify/",
            method: "POST",
            body: { token: accessToken },
        },
        api,
        extraOptions
    );
    return !(result.error && result.error.status === 401);
};

const baseQueryWithReauth = async (
    args: string | FetchArgs,
    api: any,
    extraOptions: any
) => {
    if (typeof args === "string") {
        args = { url: args };
    }
    const state = api.getState() as RootState;
    let accessToken: string | null | undefined = state.auth.tokens.access_token;
    let refreshToken: string | null | undefined =
        state.auth.tokens.refresh_token;
    if (accessToken) {
        const isValid = await verifyAccessToken(accessToken, api, extraOptions);
        if (!isValid) {
            console.warn("Access token invalid. Will attempt refresh...");
            accessToken = undefined;
        }
    }

    const headers: Record<string, string> = {
        ...(args.headers as Record<string, string>) ?? {},
    };
    
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    let result = await baseQuery({ ...args, headers }, api, extraOptions);
    if (result?.error?.status === 401 && refreshToken) {
        console.warn("Access token expired. Trying to refresh...");
        const refreshResult = await baseQuery(
            {
                url: "/token/refresh/",
                method: "POST",
                body: { refresh: refreshToken },
            },
            api,
            extraOptions
        );
        const refreshData = refreshResult.data as
            | { access?: string; refresh?: string }
            | undefined;
        const newAccessToken = refreshData?.access;
        const newRefreshToken = refreshData?.refresh ?? refreshToken;
        if (newAccessToken) {
            accessToken = newAccessToken;
            refreshToken = newRefreshToken;
            api.dispatch(
                setAuth({
                    user: state.auth.user,
                    tokens: {
                        access_token: newAccessToken,
                        refresh_token: newRefreshToken ?? null,
                    },
                })
            );
            headers["Authorization"] = `Bearer ${newAccessToken}`;
            result = await baseQuery({ ...args, headers }, api, extraOptions);
        } else {
            console.error("Refresh token expired or invalid. Logging out...");
            clearSessionAuth();
            api.dispatch(logout());
        }
    } else if (!refreshToken) {
        console.warn("No refresh token found. Logging out...");
        clearSessionAuth();
        api.dispatch(logout());
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
