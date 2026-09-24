import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Order } from "../../../types";

interface OrderState {
    orders: Order[];
    order: Order | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: OrderState = {
    orders: [],
    order: null,
    pager: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
    error: null
};

export const getOrders = createAsyncThunk("order/getOrders", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getOrder = createAsyncThunk("order/getOrder", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/orders/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("order/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/orders`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("order/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/orders/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("order/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/orders/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.pending, (state) => {
            state.orders = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getOrders.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.orders = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getOrders.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        });
        builder.addCase(getOrder.pending, (state) => {
            state.order = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getOrder.fulfilled, (state, { payload }) => {
            state.order = payload;
            state.isLoading = false;
        });
        builder.addCase(getOrder.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
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
            const { status, message, order } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.order = order;
            } else {
                state.isSuccess = false;
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
                state.isDeleted = false;
                state.error = { message };
            }
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default orderSlice.reducer;

export const { resetSuccess, resetDeleted } = orderSlice.actions;
