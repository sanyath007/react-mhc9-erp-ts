import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Department } from "../../../types";

interface DepartmentState {
    department: Department | null;
    departments: Department[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: DepartmentState = {
    department: null,
    departments: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const getDepartments = createAsyncThunk("department/getDepartments", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("department/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/departments`, data);
        dispatch(getDepartments({ url: `/api/departments` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("department/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/departments/${id}`, data);
        dispatch(getDepartments({ url: `/api/departments` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("department/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/departments/${id}`);
        dispatch(getDepartments({ url: `/api/departments` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {
        addDepartment: (state, { payload }: PayloadAction<Department>) => {
            state.departments.push(payload);
        },
        updateDepartment: (state, { payload }: PayloadAction<Department>) => {
            state.departments = state.departments.map(dep => {
                if (dep.id === payload.id) return payload;
                return dep;
            });
        },
        deleteDepartment: (state, { payload }: PayloadAction<Department>) => {
            state.departments.push(payload); // Note: keeping original logic, though this looks like it adds it instead of deleting
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getDepartments.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getDepartments.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.departments = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getDepartments.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(store.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(update.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(destroy.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
    }
});

export default departmentSlice.reducer;

export const {
    addDepartment,
    updateDepartment,
    deleteDepartment
} = departmentSlice.actions;
