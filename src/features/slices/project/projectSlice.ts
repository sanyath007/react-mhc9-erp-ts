import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Project } from "../../../types";

interface ProjectState {
    project: Project | null;
    projects: Project[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: ProjectState = {
    project: null,
    projects: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const getProjects = createAsyncThunk("project/getProjects", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getProject = createAsyncThunk("project/getProject", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/projects/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("project/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/projects`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("project/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/projects/${id}`, data);
        dispatch(getProjects({ url: '/api/projects' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("project/destroy", async ({ id }: { id: number | string }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/projects/${id}`);
        dispatch(getProjects({ url: '/api/projects' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProjects.pending, (state) => {
            state.projects = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getProjects.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.projects = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getProjects.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getProject.pending, (state) => {
            state.project = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getProject.fulfilled, (state, { payload }) => {
            state.project = payload;
            state.isLoading = false;
        });
        builder.addCase(getProject.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
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
            state.isSuccess = false;
            state.error = null;
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
            state.isSuccess = false;
            state.error = null;
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

export default projectSlice.reducer;

export const { resetSuccess } = projectSlice.actions;
