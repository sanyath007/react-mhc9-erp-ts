import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { Comset } from "../../../types";

interface ComsetState {
    comsets: Comset[];
    comset: Comset | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: ComsetState = {
    comsets: [],
    comset: null,
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getComsets = createAsyncThunk("comset/getComsets", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error);
    }
});

export const getComset = createAsyncThunk("comset/getComset", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/comsets/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("comset/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/comsets`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("comset/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/comsets/${id}/update`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error);
    }
});

export const comsetSlice = createSlice({
    name: 'comset',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getComsets.pending, (state) => {
            state.comsets = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getComsets.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.isLoading = false;
            state.comsets = data;
            state.pager = pager;
        });
        builder.addCase(getComsets.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getComset.pending, (state) => {
            state.isLoading = true;
            state.comset = null;
            state.error = null;
        });
        builder.addCase(getComset.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.comset = payload;
        });
        builder.addCase(getComset.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.comset = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, comset } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.comset = comset;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.comset = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, comset } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.comset = comset;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default comsetSlice.reducer;

export const { resetDeleted, resetSuccess } = comsetSlice.actions;
