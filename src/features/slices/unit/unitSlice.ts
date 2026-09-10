import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Unit } from "../../../types";

interface UnitState {
    unit: Unit | null;
    units: Unit[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: UnitState = {
    unit: null,
    units: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getUnits = createAsyncThunk("unit/getUnits", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getUnit = createAsyncThunk("unit/getUnit", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/units/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("unit/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/units`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("unit/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/units/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("unit/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/units/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const unitSlice = createSlice({
    name: 'unit',
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
        builder.addCase(getUnits.pending, (state) => {
            state.units = [];
            state.pager = null;
            state.error = null;
            state.isLoading = true;
        });
        builder.addCase(getUnits.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.units = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getUnits.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getUnit.pending, (state) => {
            state.unit = null;
            state.error = null;
            state.isLoading = true;
        });
        builder.addCase(getUnit.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            // Original code assigned to state.units instead of state.unit
            state.units = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getUnit.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, unit } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.unit = unit;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, unit } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.unit = unit;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.isDeleted = false;
            state.error = null;
        });
        builder.addCase(destroy.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isDeleted = true;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default unitSlice.reducer;

export const { resetSuccess, resetDeleted } = unitSlice.actions;
