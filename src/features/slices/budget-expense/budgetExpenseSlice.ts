import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { BudgetExpense } from "../../../types";

interface BudgetExpenseState {
    expense: BudgetExpense | null;
    expenses: BudgetExpense[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: BudgetExpenseState = {
    expense: null,
    expenses: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getBudgetExpenses = createAsyncThunk("budgetExpense/getBudgetExpenses", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllBudgetExpenses = createAsyncThunk("budgetExpense/getAllBudgetExpenses", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getBudgetExpense = createAsyncThunk("budgetExpense/getBudgetExpense", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budget-expenses/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("budgetExpense/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-expenses`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("budgetExpense/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-expenses/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("budgetExpense/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-expenses/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const storeDetail = createAsyncThunk("budgetExpense/storeDetail", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-expenses/${id}/details/store`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateDetail = createAsyncThunk("budgetExpense/updateDetail", async ({ id, detailId, data }: { id: number | string, detailId: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-expenses/${id}/details/${detailId}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const budgetExpenseSlice = createSlice({
    name: 'budgetExpense',
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
        builder.addCase(getBudgetExpenses.pending, (state) => {
            state.expenses = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgetExpenses.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.expenses = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getBudgetExpenses.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllBudgetExpenses.pending, (state) => {
            state.expenses = [];
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllBudgetExpenses.fulfilled, (state, { payload }) => {
            state.expenses = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllBudgetExpenses.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getBudgetExpense.pending, (state) => {
            state.expense = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgetExpense.fulfilled, (state, { payload }) => {
            state.expense = payload;
            state.isLoading = false;
        });
        builder.addCase(getBudgetExpense.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.expense = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, expense } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.expense = expense;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.expense = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, project } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.expense = project;
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
        builder.addCase(storeDetail.pending, (state) => {
            state.isSuccess = false;
            state.expense = null;
            state.error = null;
        });
        builder.addCase(storeDetail.fulfilled, (state, { payload }: any) => {
            const { status, message, expense } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.expense = expense;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(storeDetail.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default budgetExpenseSlice.reducer;

export const { resetSuccess, resetDeleted } = budgetExpenseSlice.actions;
