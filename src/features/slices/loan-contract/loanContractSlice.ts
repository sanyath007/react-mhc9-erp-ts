import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { LoanContract } from "../../../types";

interface LoanContractState {
    contract: LoanContract | null;
    contracts: LoanContract[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    isUploaded: boolean;
    error: any;
}

const initialState: LoanContractState = {
    contract: null,
    contracts: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    isUploaded: false,
    error: null
};

export const getContracts = createAsyncThunk("loan-contract/getContracts", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getContract = createAsyncThunk("loan-contract/getContract", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/loan-contracts/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getReport = createAsyncThunk("loan-contract/getReport", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("loan-contract/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("loan-contract/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("loan-contract/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const upload = createAsyncThunk("loan-contract/upload", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts/${id}/upload`, data);
        dispatch(updateImage(res.data?.img_url));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const approve = createAsyncThunk("loan-contract/approve", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts/${id}/approve`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deposit = createAsyncThunk("loan-contract/deposit", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts/${id}/deposit`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const cancel = createAsyncThunk("loan-contract/cancel", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loan-contracts/${id}/cancel`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const loanContractSlice = createSlice({
    name: 'loanContract',
    initialState,
    reducers: {
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetUploaded: (state) => {
            state.isUploaded = false;
        },
        updateImage: (state, { payload }: PayloadAction<string>) => {
            if (state.contract) {
                state.contract = { ...state.contract, img_url: payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getContracts.pending, (state) => {
            state.contracts = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getContracts.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.contracts = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getContracts.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getContract.pending, (state) => {
            state.contract = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getContract.fulfilled, (state, { payload }: any) => {
            state.contract = payload;
            state.isLoading = false;
        });
        builder.addCase(getContract.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getReport.pending, (state) => {
            state.contracts = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getReport.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.contracts = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getReport.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state) => {
            state.isSuccess = true;
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state) => {
            state.isSuccess = true;
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
        builder.addCase(upload.pending, (state) => {
            state.isUploaded = false;
            state.error = null;
        });
        builder.addCase(upload.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isUploaded = true;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(upload.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(approve.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(approve.fulfilled, (state, { payload }: any) => {
            const { status, message, contract } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.contract = contract;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(approve.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(deposit.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(deposit.fulfilled, (state, { payload }: any) => {
            const { status, message, contract } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.contract = contract;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(deposit.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(cancel.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(cancel.fulfilled, (state, { payload }: any) => {
            const { status, message, contract } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.contract = contract;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(cancel.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default loanContractSlice.reducer;

export const {
    resetDeleted,
    resetSuccess,
    resetUploaded,
    updateImage
} = loanContractSlice.actions;
