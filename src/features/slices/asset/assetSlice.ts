import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Asset } from "../../../types";

interface AssetState {
    asset: Asset | null;
    assets: Asset[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isUploaded: boolean;
    error: any;
}

const initialState: AssetState = {
    asset: null,
    assets: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isUploaded: false,
    error: null
};

export const getAssets = createAsyncThunk("asset/getAssets", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getAsset = createAsyncThunk("asset/getAsset", async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/assets/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("asset/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/assets`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("asset/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/assets/${id}/update`, data);
        dispatch(getAssets({ url: '/api/assets' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("asset/destroy", async ({ id }: { id: number | string }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/assets/${id}/delete`);
        dispatch(getAssets({ url: '/api/assets' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const upload = createAsyncThunk("asset/upload", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/assets/${id}/upload`, data);
        dispatch(updateImage(res.data?.img_url));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetUploaded: (state) => {
            state.isUploaded = false;
        },
        updateImage: (state, { payload }: PayloadAction<string>) => {
            if (state.asset) {
                state.asset = { ...state.asset, img_url: payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAssets.pending, (state) => {
            state.assets = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAssets.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.assets = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getAssets.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getAsset.pending, (state) => {
            state.asset = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAsset.fulfilled, (state, { payload }) => {
            state.asset = payload;
            state.isLoading = false;
        });
        builder.addCase(getAsset.rejected, (state, { payload }) => {
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
        builder.addCase(upload.pending, (state) => {
            state.isUploaded = false;
            state.error = null;
        });
        builder.addCase(upload.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isUploaded = true;
            } else {
                state.isUploaded = false;
                state.error = { message };
            }
        });
        builder.addCase(upload.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default assetSlice.reducer;

export const { resetSuccess, resetUploaded, updateImage } = assetSlice.actions;
