import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { BudgetAllocation } from "../../../types";

interface BudgetAllocationState {
    allocation: BudgetAllocation | null;
    allocations: BudgetAllocation[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    isUploaded: boolean;
    error: any;
}

const initialState: BudgetAllocationState = {
    allocation: null,
    allocations: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    isUploaded: false,
    error: null
};

export const getAllocations = createAsyncThunk("allocation/getAllocations", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllAllocations = createAsyncThunk("allocation/getAllAllocations", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllocation = createAsyncThunk("allocation/getAllocation", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budget-allocations/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllocationsByBudget = createAsyncThunk("allocation/getAllocationsByBudget", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budget-allocations/budget/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("allocation/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-allocations`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("allocation/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-allocations/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("allocation/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-allocations/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const upload = createAsyncThunk("allocation/upload", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-allocations/${id}/upload`, data);
        dispatch(updateImage(res.data?.img_url));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const budgetAllocationSlice = createSlice({
    name: 'budgetAllocation',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        resetUploaded: (state) => {
            state.isUploaded = false;
        },
        updateImage: (state, { payload }: PayloadAction<string>) => {
            if (state.allocation) {
                state.allocation = { ...state.allocation, img_url: payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllocations.pending, (state) => {
            state.allocations = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllocations.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.allocations = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getAllocations.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllAllocations.pending, (state) => {
            state.allocations = [];
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllAllocations.fulfilled, (state, { payload }) => {
            state.allocations = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllAllocations.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllocation.pending, (state) => {
            state.allocation = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllocation.fulfilled, (state, { payload }) => {
            state.allocation = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllocation.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllocationsByBudget.pending, (state) => {
            state.allocations = [];
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllocationsByBudget.fulfilled, (state, { payload }) => {
            state.allocations = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllocationsByBudget.rejected, (state, { payload }) => {
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
            const { status, message } = payload;
            if (status === 1) {
                state.isSuccess = true;
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
    }
});

export default budgetAllocationSlice.reducer;

export const { resetSuccess, resetDeleted, resetUploaded, updateImage } = budgetAllocationSlice.actions;
