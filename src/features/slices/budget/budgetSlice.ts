import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Budget } from "../../../types";

interface BudgetState {
    budget: Budget | null;
    budgets: Budget[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: BudgetState = {
    budget: null,
    budgets: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getBudgets = createAsyncThunk("budget/getBudgets", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getBudget = createAsyncThunk("budget/getBudget", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budgets/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllBudgetsOfYear = createAsyncThunk("budget/getAllBudgetsOfYear", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("budget/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budgets`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("budget/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budgets/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("budget/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budgets/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const toggle = createAsyncThunk("budget/toggle", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budgets/${id}/toggle`, data);
        dispatch(updateBudgets({ id, budget: res.data.budget }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        updateBudgets: (state, { payload }: PayloadAction<{ id: number | string, budget: Budget }>) => {
            state.budgets = state.budgets.map(budget => {
                if (payload.id === budget.id) return payload.budget;
                return budget;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBudgets.pending, (state) => {
            state.budgets = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgets.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.budgets = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getBudgets.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getBudget.pending, (state) => {
            state.budget = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudget.fulfilled, (state, { payload }) => {
            state.budget = payload;
            state.isLoading = false;
        });
        builder.addCase(getBudget.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllBudgetsOfYear.pending, (state) => {
            state.budgets = [];
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllBudgetsOfYear.fulfilled, (state, { payload }) => {
            state.budgets = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllBudgetsOfYear.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.budget = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, budget } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.budget = budget;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.budget = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, budget } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.budget = budget;
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
        builder.addCase(toggle.pending, (state) => {
            state.isSuccess = false;
            state.budget = null;
            state.error = null;
        });
        builder.addCase(toggle.fulfilled, (state, { payload }: any) => {
            const { status, message, budget } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.budget = budget;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(toggle.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default budgetSlice.reducer;

export const { resetSuccess, resetDeleted, updateBudgets } = budgetSlice.actions;
