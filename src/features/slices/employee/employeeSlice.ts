import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Employee, PaginatedResponse } from "../../../types";

interface EmployeeState {
    employee: Employee | null;
    employees: Employee[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    isUploaded: boolean;
    error: any;
}

const initialState: EmployeeState = {
    employee: null,
    employees: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    isUploaded: false,
    error: null
};

export const getEmployees = createAsyncThunk("employee/getEmployees", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getEmployee = createAsyncThunk("employee/getEmployee", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/employees/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("employee/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/employees`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("employee/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/employees/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("employee/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/employees/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const upload = createAsyncThunk("employee/upload", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/employees/${id}/upload`, data);
        dispatch(updateAvatar(res.data?.avatar_url));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const employeeSlice = createSlice({
    name: "employee",
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
        updateAvatar: (state, action: PayloadAction<string>) => {
            if (state.employee) {
                state.employee = { ...state.employee, avatar_url: action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getEmployees.pending, (state) => {
            state.employees = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getEmployees.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.employees = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getEmployees.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getEmployee.pending, (state) => {
            state.employee = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getEmployee.fulfilled, (state, { payload }) => {
            state.employee = payload;
            state.isLoading = false;
        });
        builder.addCase(getEmployee.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, employee } = payload;
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
            const { status, message, employee } = payload;
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

export default employeeSlice.reducer;

export const {
    resetDeleted,
    resetSuccess,
    resetUploaded,
    updateAvatar
} = employeeSlice.actions;
