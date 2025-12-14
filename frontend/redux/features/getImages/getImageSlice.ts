import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
    title: string;
    page: number;
    category: string;
    keyword: string;
}

const initialState: SearchState = {
    title: '',
    page: 1,
    category: '',
    keyword: '',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload;
        },
        setKeyword: (state, action: PayloadAction<string>) => {
            state.keyword = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setSearch: (state, action: PayloadAction<SearchState>) => {
            return { ...state, ...action.payload };
        },
        resetSearch: () => initialState,
    },
});

export const { setTitle, setPage, setCategory, setKeyword, resetSearch, setSearch } =
    searchSlice.actions;

export default searchSlice.reducer;
