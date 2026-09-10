import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Room } from "../../../types";

interface RoomState {
    rooms: Room[];
    pager: any;
    loading: boolean;
    success: boolean;
    error: any;
}

const initialState: RoomState = {
    rooms: [],
    pager: null,
    loading: false,
    success: false,
    error: null
};

export const getRooms = createAsyncThunk("room/getRooms", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/rooms`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("room/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/rooms`, data);
        dispatch(getRooms(null));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("room/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/rooms/${id}`, data);
        dispatch(getRooms(null));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("room/destroy", async ({ id, data }: { id: number | string, data?: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.put(`/api/rooms/${id}`, data);
        dispatch(getRooms(null));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        addRoom: (state, { payload }: PayloadAction<Room>) => {
            // Original code used state.types instead of state.rooms, fixing it here
            state.rooms = [...state.rooms, payload];
        },
        updateRoom: (state, { payload }: PayloadAction<Room>) => {
            state.rooms = state.rooms.map(dep => {
                if (dep.id === payload.id) return payload;
                return dep;
            });
        },
        deleteRoom: (state, { payload }: PayloadAction<Room>) => {
            state.rooms = [...state.rooms, payload] as any;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getRooms.pending, (state) => {
            state.rooms = [];
            state.pager = null;
            state.loading = true;
        });
        builder.addCase(getRooms.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.rooms = data;
            state.pager = pager;
            state.loading = false;
        });
        builder.addCase(getRooms.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.rooms = [];
            state.pager = null;
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
            state.rooms = [];
            state.pager = null;
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

export default roomSlice.reducer;

export const {
    addRoom,
    updateRoom,
    deleteRoom
} = roomSlice.actions;
