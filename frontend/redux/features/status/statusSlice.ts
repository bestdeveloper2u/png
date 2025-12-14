import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    upload: false,
    edit: false,
    delete: false,
};

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true;
        },
        stopLoading: (state) => {
            state.loading = false;
        },
        startUpload: (state) => {
            state.upload = true;
        },
        finishUpload: (state) => {
            state.upload = false;
        },
        startEdit: (state) => {
            state.edit = true;
        },
        finishEdit: (state) => {
            state.edit = false;
        },
        startDelete: (state) => {
            state.delete = true;
        },
        finishDelete: (state) => {
            state.delete = false;
        },
    },
});

export const {
    startLoading,
    stopLoading,
    startUpload,
    finishUpload,
    startEdit,
    finishEdit,
    startDelete,
    finishDelete,
} = statusSlice.actions;

export default statusSlice.reducer;
