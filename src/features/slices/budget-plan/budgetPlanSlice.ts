import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { BudgetPlan } from "../../../types";

interface BudgetPlanState {
    plan: BudgetPlan | null;
    plans: BudgetPlan[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: BudgetPlanState = {
    plan: null,
    plans: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getBudgetPlans = createAsyncThunk("budgetPaln/getBudgetPlans", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllBudgetPlans = createAsyncThunk("budgetPaln/getAllBudgetPlans", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getBudgetPlan = createAsyncThunk("budgetPaln/getBudgetPlan", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budget-plans/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("budgetPaln/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-plans`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("budgetPaln/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-plans/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("budgetPaln/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-plans/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const budgetPlanSlice = createSlice({
    name: 'budgetPlan',
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
        builder.addCase(getBudgetPlans.pending, (state) => {
            state.plans = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgetPlans.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.plans = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getBudgetPlans.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllBudgetPlans.pending, (state) => {
            state.plans = [];
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllBudgetPlans.fulfilled, (state, { payload }) => {
            state.plans = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllBudgetPlans.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getBudgetPlan.pending, (state) => {
            state.plan = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgetPlan.fulfilled, (state, { payload }) => {
            state.plan = payload;
            state.isLoading = false;
        });
        builder.addCase(getBudgetPlan.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.plan = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, plan } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.plan = plan;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.plan = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, plan } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.plan = plan;
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

export default budgetPlanSlice.reducer;

export const { resetSuccess, resetDeleted } = budgetPlanSlice.actions;
