import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../../api";
import { Item } from "../../../types";

interface ItemState {
    items: Item[];
    item: Item | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    isUploaded: boolean;
    error: any;
}

const initialState: ItemState = {
    items: [],
    item: null,
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    isUploaded: false,
    error: null
};

export const getItems = createAsyncThunk("item/getItems", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getItem = createAsyncThunk("item/getItem", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/items/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("item/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/items`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("item/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/items/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("item/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/items/${id}/delete`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const upload = createAsyncThunk("item/upload", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/items/${id}/upload`, data);
        dispatch(updateImage(res.data?.img_url));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetUploaded: (state) => {
            state.isUploaded = false;
        },
        updateImage: (state, action: PayloadAction<string>) => {
            if (state.item) {
                state.item = { ...state.item, img_url: action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getItems.pending, (state) => {
            state.items = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getItems.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.items = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getItems.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getItem.pending, (state) => {
            state.item = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getItem.fulfilled, (state, { payload }) => {
            state.item = payload;
            state.isLoading = false;
        });
        builder.addCase(getItem.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.item = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, item } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.item = item;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.item = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, item } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.item = item;
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
                state.isUploaded = false;
                state.error = { message };
            }
        });
        builder.addCase(upload.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default itemSlice.reducer;

export const {
    resetDeleted,
    resetSuccess,
    resetUploaded,
    updateImage
} = itemSlice.actions;
