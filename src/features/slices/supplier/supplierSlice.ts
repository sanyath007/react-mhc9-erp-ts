import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { Supplier } from "../../../types";

interface SupplierState {
    suppliers: Supplier[];
    supplier: Supplier | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: SupplierState = {
    suppliers: [],
    supplier: null,
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const getSuppliers = createAsyncThunk("supplier/getSuppliers", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getSupplier = createAsyncThunk("supplier/getSupplier", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/suppliers/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("supplier/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/suppliers`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("supplier/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/suppliers/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        resetIsSuccess: (state) => {
            state.isSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSuppliers.pending, (state) => {
            state.suppliers = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getSuppliers.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.suppliers = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getSuppliers.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        });
        builder.addCase(getSupplier.pending, (state) => {
            state.supplier = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getSupplier.fulfilled, (state, { payload }) => {
            state.supplier = payload;
            state.isLoading = false;
        });
        builder.addCase(getSupplier.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        });
        builder.addCase(store.pending, (state) => {
            state.error = null;
            state.isSuccess = false;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, ...data } = payload;
            if (status === 1) {
                state.isSuccess = true;
            } else {
                state.error = message;
                state.isSuccess = false;
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
            state.isSuccess = false;
        });
        builder.addCase(update.pending, (state) => {
            state.error = null;
            state.isSuccess = false;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message } = payload;
            if (status === 1) {
                state.isSuccess = true;
            } else {
                state.error = message;
                state.isSuccess = false;
            }
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            state.error = payload;
            state.isSuccess = false;
        });
    }
});

export default supplierSlice.reducer;

export const { resetIsSuccess } = supplierSlice.actions;
