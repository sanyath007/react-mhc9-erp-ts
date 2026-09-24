import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { AssetType } from "../../../types";

interface AssetTypeState {
    types: AssetType[];
    pager: any;
    loading: boolean;
    success: boolean;
    error: any;
}

const initialState: AssetTypeState = {
    types: [],
    pager: null,
    loading: false,
    success: false,
    error: null
};

export const getAssetTypes = createAsyncThunk("asset-type/getAssetTypes", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/asset-types`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("asset-type/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/asset-types`, data);
        dispatch(addAssetType(res.data.types));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("asset-type/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/asset-types/${id}`, data);
        dispatch(updateAssetType(res.data.types));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("asset-type/destroy", async ({ id, data }: { id: number | string, data?: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/asset-types/${id}`, data);
        dispatch(deleteAssetType(res.data.types));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const assetTypeSlice = createSlice({
    name: 'assetType',
    initialState,
    reducers: {
        addAssetType: (state, { payload }: PayloadAction<AssetType>) => {
            state.types = [...state.types, payload];
        },
        updateAssetType: (state, { payload }: PayloadAction<AssetType>) => {
            state.types = state.types.map(dep => {
                if (dep.id === payload.id) return payload;
                return dep;
            });
        },
        deleteAssetType: (state, { payload }: PayloadAction<AssetType>) => {
            state.types = [...state.types, payload] as any;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAssetTypes.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAssetTypes.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.types = data;
            state.pager = pager;
            state.loading = false;
        });
        builder.addCase(getAssetTypes.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(store.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(update.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(destroy.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
    }
});

export default assetTypeSlice.reducer;

export const {
    addAssetType,
    updateAssetType,
    deleteAssetType
} = assetTypeSlice.actions;
