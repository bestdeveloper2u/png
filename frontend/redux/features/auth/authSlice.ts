import { AuthStateType } from "@/types/authStateType";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "auth";

const readStoredAuth = (): AuthStateType | null => {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const storedAuth = sessionStorage.getItem(STORAGE_KEY);
        return storedAuth ? JSON.parse(storedAuth) : null;
    } catch {
        return null;
    }
};

let initialState: AuthStateType = readStoredAuth() ?? {
    user: null,
    tokens: {
        access_token: null,
        refresh_token: null,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthStateType>) => {
            state.user = action.payload.user;
            state.tokens.access_token = action.payload.tokens.access_token;
            state.tokens.refresh_token = action.payload.tokens.refresh_token;
            if (typeof window !== "undefined") {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
            }
        },
        logout: (state) => {
            state.user = null;
            state.tokens.access_token = null;
            state.tokens.refresh_token = null;
            if (typeof window !== "undefined") {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
