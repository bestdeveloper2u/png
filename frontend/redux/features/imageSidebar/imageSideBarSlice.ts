import { ImagesResponse } from '@/types/imagesResponse';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ImageSideBarState {
    sideBar: boolean;
    selectedMetadata?: ImagesResponse;
    triggerBulkSave: boolean;
    selectedImageIds: number[];
}

const initialState: ImageSideBarState = {
    sideBar: false,
    selectedMetadata: undefined,
    triggerBulkSave: false,
    selectedImageIds: [],
}

const imageSideBarSlice = createSlice({
    name: 'imageSideBar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sideBar = !state.sideBar;
        },
        openSidebar: (state) => {
            state.sideBar = true;
        },
        closeSidebar: (state) => {
            state.sideBar = false;
        },
        setSelectedMetadata: (
            state,
            action: PayloadAction<ImagesResponse>
        ) => {
            state.selectedMetadata = action.payload;
        },
        clearSelectedMetadata: (state) => {
            state.selectedMetadata = undefined;
        },
        triggerAllSave(state) {
            state.triggerBulkSave = true;
        },
        resetAllSave(state) {
            state.triggerBulkSave = false;
        },
        setSelectedImageIds(state, action: PayloadAction<number[]>) {
            state.selectedImageIds = action.payload;
        },
        clearSelectedImageIds(state) {
            state.selectedImageIds = [];
        }
    },
});

export const {
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setSelectedMetadata,
    clearSelectedMetadata,
    triggerAllSave,
    resetAllSave,
    setSelectedImageIds,
    clearSelectedImageIds,
} = imageSideBarSlice.actions;

export default imageSideBarSlice.reducer;
