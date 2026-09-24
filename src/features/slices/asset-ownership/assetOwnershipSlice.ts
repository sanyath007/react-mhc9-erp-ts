import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { AssetOwnership } from "../../../types";

interface AssetOwnershipState {
    ownerships: AssetOwnership[];
    pager: any;
    loading: boolean;
    success: boolean;
    error: any;
}

const initialState: AssetOwnershipState = {
    ownerships: [],
    pager: null,
    loading: false,
    success: false,
    error: null,
};

export const getOwnerships = createAsyncThunk("ownership/getOwnerships", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/asset-ownerships`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getOwnershipsByAsset = createAsyncThunk("ownership/getOwnershipsByAsset", async ({ assetId }: { assetId: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/asset-ownerships/asset/${assetId}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("ownership/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/asset-ownerships`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("ownership/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/asset-ownerships/${id}`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("ownership/destroy", async ({ id }: { id: number | string }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/asset-ownerships/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const assetOwnershipSlice = createSlice({
    name: 'ownership',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOwnerships.pending, (state) => {
            state.ownerships = [];
            state.pager = null;
            state.loading = true;
        });
        builder.addCase(getOwnerships.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.ownerships = data;
            state.pager = pager;
            state.loading = false;
        });
        builder.addCase(getOwnerships.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(getOwnershipsByAsset.pending, (state) => {
            state.ownerships = [];
            state.pager = null;
            state.loading = true;
        });
        builder.addCase(getOwnershipsByAsset.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.ownerships = data;
            state.pager = pager;
            state.loading = false;
        });
        builder.addCase(getOwnershipsByAsset.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.success = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state) => {
            state.success = true;
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.success = false;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state) => {
            state.success = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.success = false;
            state.error = null;
        });
        builder.addCase(destroy.fulfilled, (state) => {
            state.success = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default assetOwnershipSlice.reducer;

export const { resetSuccess } = assetOwnershipSlice.actions;
