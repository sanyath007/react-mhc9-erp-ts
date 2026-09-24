import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Approval } from "../../../types";

interface ApprovalState {
    approval: Approval | null;
    approvals: Approval[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isUploaded: boolean;
    error: any;
}

const initialState: ApprovalState = {
    approval: null,
    approvals: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isUploaded: false,
    error: null
};

export const getApprovals = createAsyncThunk("approval/getApprovals", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getApproval = createAsyncThunk("approval/getApproval", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/approvals/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("approval/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/approvals`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("approval/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/approvals/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("approval/destroy", async ({ id }: { id: number | string }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/approvals/${id}/delete`);
        dispatch(getApprovals({ url: '/api/approvals' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const consider = createAsyncThunk("approval/consider", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/approvals/${id}/consider`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const approvalSlice = createSlice({
    name: 'approval',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getApprovals.pending, (state) => {
            state.approvals = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getApprovals.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.approvals = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getApprovals.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getApproval.pending, (state) => {
            state.approval = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getApproval.fulfilled, (state, { payload }) => {
            state.approval = payload;
            state.isLoading = false;
        });
        builder.addCase(getApproval.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.approval = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, approval } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.approval = approval;
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
            state.approval = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, approval } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.approval = approval;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(destroy.fulfilled, (state) => {
            state.isSuccess = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(consider.pending, (state) => {
            state.isSuccess = false;
            state.approval = null;
            state.error = null;
        });
        builder.addCase(consider.fulfilled, (state, { payload }: any) => {
            const { status, message, approval } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.approval = approval;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(consider.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default approvalSlice.reducer;

export const { resetSuccess } = approvalSlice.actions;
