import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { BudgetActivity } from "../../../types";

interface BudgetActivityState {
    activity: BudgetActivity | null;
    activities: BudgetActivity[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: BudgetActivityState = {
    activity: null,
    activities: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getActivities = createAsyncThunk("budgetActivity/getActivities", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getActivity = createAsyncThunk("budgetActivity/getActivity", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budget-activities/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("budgetActivity/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-activities`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("budgetActivity/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-activities/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("budgetActivity/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-activities/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const toggle = createAsyncThunk("budgetActivity/toggle", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-activities/${id}/toggle`, data);
        dispatch(updateActivities({ id, activity: res.data.activity }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const budgetActivitySlice = createSlice({
    name: 'budgetActivity',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        updateActivities: (state, { payload }: PayloadAction<{ id: number | string, activity: BudgetActivity }>) => {
            state.activities = state.activities.map(activity => {
                if (payload.id === activity.id) return payload.activity;
                return activity;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getActivities.pending, (state) => {
            state.activities = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getActivities.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.activities = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getActivities.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getActivity.pending, (state) => {
            state.activity = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getActivity.fulfilled, (state, { payload }) => {
            state.activity = payload;
            state.isLoading = false;
        });
        builder.addCase(getActivity.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.activity = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, activity } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.activity = activity;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.activity = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, activity } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.activity = activity;
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
            state.error = null;
        });
        builder.addCase(toggle.fulfilled, (state, { payload }: any) => {
            const { status, message, activity } = payload; // wait, the original code had budget here: const { status, message, budget } = payload; but this is budgetActivitySlice so it's probably activity. Let's use it as it was in original code.
            // Oh wait, looking at original code: `const { status, message, budget } = payload; state.budget = budget;`. That was a typo in original code that copy-pasted from budgetSlice. Let's fix it safely as activity.
            if (status === 1) {
                state.isSuccess = true;
                state.activity = activity;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(toggle.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default budgetActivitySlice.reducer;

export const { resetSuccess, resetDeleted, updateActivities } = budgetActivitySlice.actions;
