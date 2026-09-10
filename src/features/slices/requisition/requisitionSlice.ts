import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Requisition } from "../../../types";

interface RequisitionState {
    requisition: Requisition | null;
    requisitions: Requisition[];
    pager: any;
    headOfDepart: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: RequisitionState = {
    requisition: null,
    requisitions: [],
    pager: null,
    headOfDepart: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getRequisitions = createAsyncThunk("requisition/getRequisitions", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRequisition = createAsyncThunk("requisition/getRequisition", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/requisitions/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRequisitionWithHeadOfDepart = createAsyncThunk("requisition/getRequisitionWithHeadOfDepart", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/requisitions/${id}/with`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getReports = createAsyncThunk("requisition/getReports", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("requisition/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/requisitions`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("requisition/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/requisitions/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("requisition/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/requisitions/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const requisitionSlice = createSlice({
    name: 'requisition',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        updateApprovals: (state, { payload }: PayloadAction<any>) => {
            if (state.requisition) {
                state.requisition = { ...state.requisition, approvals: [payload] };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getRequisitions.pending, (state) => {
            state.requisitions = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getRequisitions.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.requisitions = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getRequisitions.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getRequisition.pending, (state) => {
            state.requisition = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getRequisition.fulfilled, (state, { payload }) => {
            state.requisition = payload;
            state.isLoading = false;
        });
        builder.addCase(getRequisition.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getRequisitionWithHeadOfDepart.pending, (state) => {
            state.requisition = null;
            state.headOfDepart = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getRequisitionWithHeadOfDepart.fulfilled, (state, { payload }: any) => {
            const { requisition, headOfDepart } = payload;
            state.requisition = requisition;
            state.headOfDepart = headOfDepart;
            state.isLoading = false;
        });
        builder.addCase(getRequisitionWithHeadOfDepart.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getReports.pending, (state) => {
            state.requisitions = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getReports.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.requisitions = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getReports.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
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
            console.log(payload);
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }) => {
            console.log(payload);
            state.isSuccess = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            console.log(payload);
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

export default requisitionSlice.reducer;

export const { resetSuccess, resetDeleted, updateApprovals } = requisitionSlice.actions;
