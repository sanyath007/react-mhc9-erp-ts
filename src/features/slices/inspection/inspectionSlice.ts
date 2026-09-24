import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Inspection } from "../../../types";

interface InspectionState {
    inspections: Inspection[];
    inspection: Inspection | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: InspectionState = {
    inspections: [],
    inspection: null,
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getInspections = createAsyncThunk("inspection/getInspections", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getInspection = createAsyncThunk("inspection/getInspection", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/inspections/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("inspection/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/inspections`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("inspection/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/inspections/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("inspection/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/inspections/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const inspectionSlice = createSlice({
    name: 'inspection',
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
        builder.addCase(getInspections.pending, (state) => {
            state.inspections = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getInspections.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.inspections = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getInspections.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        });
        builder.addCase(getInspection.pending, (state) => {
            state.inspection = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getInspection.fulfilled, (state, { payload }) => {
            state.inspection = payload;
            state.isLoading = false;
        });
        builder.addCase(getInspection.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isSuccess = true;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.inspection = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, inspection } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.inspection = inspection;
            } else {
                state.isSuccess = false;
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
                state.isDeleted = false;
                state.error = { message };
            }
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default inspectionSlice.reducer;

export const { resetDeleted, resetSuccess } = inspectionSlice.actions;
