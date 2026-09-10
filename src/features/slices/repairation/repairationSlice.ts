import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Repairation } from "../../../types";

interface RepairationState {
    repairation: Repairation | null;
    repairations: Repairation[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: RepairationState = {
    repairation: null,
    repairations: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null,
};

export const getRepairations = createAsyncThunk("repairation/getRepairations", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRepairation = createAsyncThunk("repairation/getRepairation", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/repairations/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getRepairationsByAsset = createAsyncThunk("repairation/getRepairationsByAsset", async (assetId: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/repairations/asset/${assetId}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("repairation/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/repairations`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const repair = createAsyncThunk("repairation/repair", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/repairations/${id}/repair`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("repairation/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/repairations/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("repairation/destroy", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/repairations/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const taskHandlingSlice = createSlice({
    name: 'taskHandling',
    initialState,
    reducers: {
        resetSuccess(state) {
            state.isSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getRepairations.pending, (state) => {
            state.isLoading = true;
            state.repairations = [];
            state.pager = null;
            state.error = null;
        });
        builder.addCase(getRepairations.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.repairations = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getRepairations.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getRepairation.pending, (state) => {
            state.isLoading = true;
            state.repairation = null;
            state.error = null;
        });
        builder.addCase(getRepairation.fulfilled, (state, { payload }) => {
            state.repairation = payload;
            state.isLoading = false;
        });
        builder.addCase(getRepairation.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getRepairationsByAsset.pending, (state) => {
            state.isLoading = true;
            state.repairations = [];
            state.pager = null;
            state.error = null;
        });
        builder.addCase(getRepairationsByAsset.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.repairations = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getRepairationsByAsset.rejected, (state, { payload }) => {
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
        builder.addCase(repair.pending, (state) => {
            state.repairation = null;
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(repair.fulfilled, (state, { payload }: any) => {
            const { status, message, repairation } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.repairation = repairation;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(repair.rejected, (state, { payload }) => {
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
        builder.addCase(destroy.pending, (state) => {
            state.isSuccess = false;
        });
        builder.addCase(destroy.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isSuccess = true;
            } else {
                state.isSuccess = false;
                state.error = { message };
            }
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default taskHandlingSlice.reducer;

export const { resetSuccess } = taskHandlingSlice.actions;
