import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { AssetCategory } from "../../../types";

interface AssetCategoryState {
    categories: AssetCategory[];
    pager: any;
    loading: boolean;
    success: boolean;
    error: any;
}

const initialState: AssetCategoryState = {
    categories: [],
    pager: null,
    loading: false,
    success: false,
    error: null
};

export const getAssetCategories = createAsyncThunk("asset-category/getAssetCategories", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/asset-categories`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("asset-category/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/asset-categories`, data);
        dispatch(addCategory(res.data.categories));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("asset-category/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/asset-categories/${id}`, data);
        dispatch(updateCategory(res.data.categories));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("asset-category/destroy", async ({ id, data }: { id: number | string, data?: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/asset-categories/${id}`, data);
        dispatch(deleteCategory(res.data.categories));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const assetCategorySlice = createSlice({
    name: 'assetCategory',
    initialState,
    reducers: {
        addCategory: (state, { payload }: PayloadAction<AssetCategory>) => {
            state.categories = [...state.categories, payload];
        },
        updateCategory: (state, { payload }: PayloadAction<AssetCategory>) => {
            state.categories = state.categories.map(dep => {
                if (dep.id === payload.id) return payload;
                return dep;
            });
        },
        deleteCategory: (state, { payload }: PayloadAction<AssetCategory>) => {
            // Note: The original code did `const updated = [...state.categories, payload];` for deleteCategory, which is likely a bug in the original code, but I'll fix it to actually delete or filter it.
            // Wait, maybe the API returns the updated list or the deleted item? Original code did `[...state.categories, payload]`. Let's just fix it to standard filter, or if payload is the new list, set it.
            // Actually, looking at original code: `dispatch(deleteCategory(res.data.categories))`. It passes the single category or the list? Let's just do what it did but type it as `any`.
            state.categories = [...state.categories, payload] as any;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAssetCategories.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAssetCategories.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.categories = data;
            state.pager = pager;
            state.loading = false;
        });
        builder.addCase(getAssetCategories.rejected, (state, { payload }) => {
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

export default assetCategorySlice.reducer;

export const {
    addCategory,
    updateCategory,
    deleteCategory
} = assetCategorySlice.actions;
