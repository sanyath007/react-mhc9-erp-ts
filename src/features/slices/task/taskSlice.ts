import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Task } from "../../../types";

interface TaskState {
    task: Task | null;
    tasks: Task[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: TaskState = {
    task: null,
    tasks: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null,
};

export const getTasks = createAsyncThunk("task/getTasks", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAllTasks = createAsyncThunk("task/getAllTasks", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getTask = createAsyncThunk("task/getTask", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/tasks/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("task/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/tasks`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const handle = createAsyncThunk("task/handle", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/tasks/${id}/handle`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("task/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/tasks/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("task/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/tasks/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        resetSuccess(state) {
            state.isSuccess = false;
        },
        resetDeleted(state) {
            state.isDeleted = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTasks.pending, (state) => {
            state.isLoading = true;
            state.tasks = [];
            state.pager = null;
            state.error = null;
        });
        builder.addCase(getTasks.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.tasks = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getTasks.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAllTasks.pending, (state) => {
            state.isLoading = true;
            state.tasks = [];
            state.error = null;
        });
        builder.addCase(getAllTasks.fulfilled, (state, { payload }) => {
            state.tasks = payload;
            state.isLoading = false;
        });
        builder.addCase(getAllTasks.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getTask.pending, (state) => {
            state.isLoading = true;
            state.task = null;
            state.error = null;
        });
        builder.addCase(getTask.fulfilled, (state, { payload }) => {
            state.task = payload;
            state.isLoading = false;
        });
        builder.addCase(getTask.rejected, (state, { payload }) => {
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
                state.isSuccess = false;
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
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(handle.pending, (state) => {
            state.isSuccess = false;
            state.task = null;
            state.error = null;
        });
        builder.addCase(handle.fulfilled, (state, { payload }: any) => {
            const { status, message, task } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.task = task;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(handle.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.isDeleted = false;
        });
        builder.addCase(destroy.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isDeleted = true;
            } else {
                state.isDeleted = false;
                state.error = { message };
            }
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default taskSlice.reducer;

export const { resetSuccess, resetDeleted } = taskSlice.actions;
