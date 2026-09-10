import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Division } from "../../../types";

interface DivisionState {
    division: Division | null;
    divisions: Division[];
    pager: any;
    loading: boolean;
    success: boolean;
    error: any;
}

const initialState: DivisionState = {
    division: null,
    divisions: [],
    pager: null,
    loading: false,
    success: false,
    error: null
};

export const getDivisions = createAsyncThunk("division/getdivisions", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getDivision = createAsyncThunk("division/getdivision", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/divisions/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("division/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/divisions`, data);
        dispatch(getDivisions({ url: `/api/divisions` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("division/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/divisions/${id}`, data);
        dispatch(getDivisions({ url: `/api/divisions` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("division/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/divisions/${id}`);
        dispatch(getDivisions({ url: `/api/divisions` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const divisionSlice = createSlice({
    name: 'division',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDivisions.pending, (state) => {
            state.divisions = [];
            state.pager = null;
            state.loading = true;
        });
        builder.addCase(getDivisions.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.divisions = data;
            state.pager = pager;
            state.loading = false;
        });
        builder.addCase(getDivisions.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(getDivision.pending, (state) => {
            state.division = null;
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getDivision.fulfilled, (state, { payload }: any) => {
            state.divisions = payload;
            state.loading = false;
        });
        builder.addCase(getDivision.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.divisions = [];
            state.pager = null;
            state.loading = true;
        });
        builder.addCase(store.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.divisions = [];
            state.pager = null;
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(destroy.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
    }
});

export default divisionSlice.reducer;
