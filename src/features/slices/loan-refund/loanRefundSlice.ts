import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { LoanRefund } from "../../../types";

interface LoanRefundState {
    refund: LoanRefund | null;
    refunds: LoanRefund[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: LoanRefundState = {
    refund: null,
    refunds: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getRefunds = createAsyncThunk("loan-refund/getRefunds", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRefund = createAsyncThunk("loan-refund/getRefund", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/loan-refunds/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("loan-refund/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-refunds`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("loan-refund/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-refunds/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("loan-refund/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-refunds/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const approve = createAsyncThunk("loan-refund/approve", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-refunds/${id}/approve`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const receipt = createAsyncThunk("loan-refund/receipt", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-refunds/${id}/receipt`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const loanRefundSlice = createSlice({
    name: 'loanRefund',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        updateImage: (state, { payload }: PayloadAction<string>) => {
            if (state.refund) {
                state.refund = { ...state.refund, img_url: payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getRefunds.pending, (state) => {
            state.refunds = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getRefunds.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.refunds = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getRefunds.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getRefund.pending, (state) => {
            state.refund = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getRefund.fulfilled, (state, { payload }: any) => {
            state.refund = payload;
            state.isLoading = false;
        });
        builder.addCase(getRefund.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.refund = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, refund } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.refund = refund;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.refund = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, refund } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.refund = refund;
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
        builder.addCase(approve.pending, (state) => {
            state.isSuccess = false;
            state.refund = null;
            state.error = null;
        });
        builder.addCase(approve.fulfilled, (state, { payload }: any) => {
            const { status, message, refund } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.refund = refund;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(approve.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(receipt.pending, (state) => {
            state.isSuccess = false;
            state.refund = null;
            state.error = null;
        });
        builder.addCase(receipt.fulfilled, (state, { payload }: any) => {
            const { status, message, refund } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.refund = refund;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(receipt.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default loanRefundSlice.reducer;

export const { resetSuccess, resetDeleted, updateImage } = loanRefundSlice.actions;
