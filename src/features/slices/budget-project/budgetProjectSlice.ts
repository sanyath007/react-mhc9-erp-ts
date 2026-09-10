import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { BudgetProject } from "../../../types";

interface BudgetProjectState {
    project: BudgetProject | null;
    projects: BudgetProject[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: BudgetProjectState = {
    project: null,
    projects: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getBudgetProjects = createAsyncThunk("budgetProject/getBudgetProjects", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllBudgetProjects = createAsyncThunk("budgetProject/getAllBudgetProjects", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getBudgetProject = createAsyncThunk("budgetProject/getBudgetProject", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/budget-projects/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("budgetProject/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-projects`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("budgetProject/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-projects/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("budgetProject/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/budget-projects/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const budgetProjectSlice = createSlice({
    name: 'budgetProject',
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
        builder.addCase(getBudgetProjects.pending, (state) => {
            state.projects = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgetProjects.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.projects = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getBudgetProjects.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllBudgetProjects.pending, (state) => {
            state.projects = [];
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAllBudgetProjects.fulfilled, (state, { payload }) => {
            state.projects = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllBudgetProjects.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getBudgetProject.pending, (state) => {
            state.project = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getBudgetProject.fulfilled, (state, { payload }) => {
            state.project = payload;
            state.isLoading = false;
        });
        builder.addCase(getBudgetProject.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.project = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, project } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.project = project;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.project = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, project } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.project = project;
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

export default budgetProjectSlice.reducer;

export const { resetSuccess, resetDeleted } = budgetProjectSlice.actions;
