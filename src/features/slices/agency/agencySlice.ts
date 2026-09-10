import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Agency } from "../../../types";

interface AgencyState {
    agency: Agency | null;
    agencies: Agency[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: AgencyState = {
    agency: null,
    agencies: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const getAgencies = createAsyncThunk("agency/getAgencies", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAgency = createAsyncThunk("agency/getAgency", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/agencies/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("agency/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/agencies`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("agency/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/agencies/${id}`, data);
        dispatch(getAgencies({ url: '/api/agencies' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("agency/destroy", async ({ id }: { id: number | string }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/agencies/${id}`);
        dispatch(getAgencies({ url: '/api/agencies' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const agencySlice = createSlice({
    name: 'agency',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAgencies.pending, (state) => {
            state.agencies = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAgencies.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.agencies = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getAgencies.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAgency.pending, (state) => {
            state.agency = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAgency.fulfilled, (state, { payload }) => {
            state.agency = payload;
            state.isLoading = false;
        });
        builder.addCase(getAgency.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, agency } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.agency = agency;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(destroy.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
    }
});

export default agencySlice.reducer;

export const { resetSuccess } = agencySlice.actions;
