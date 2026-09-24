import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";
import { Place } from "../../../types";

interface PlaceState {
    places: Place[];
    place: Place | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: PlaceState = {
    places: [],
    place: null,
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const getPlaces = createAsyncThunk("place/getPlaces", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getPlace = createAsyncThunk("place/getPlace", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/places/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("place/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/places`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("place/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/places/${id}/update`, data);
        dispatch(getPlaces({ url: '/api/places' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("place/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/places/${id}/delete`);
        dispatch(getPlaces({ url: '/api/places' }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const placeSlice = createSlice({
    name: 'place',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPlaces.pending, (state) => {
            state.places = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getPlaces.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.places = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getPlaces.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getPlace.pending, (state) => {
            state.place = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getPlace.fulfilled, (state, { payload }) => {
            state.place = payload;
            state.isLoading = false;
        });
        builder.addCase(getPlace.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, place } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.place = place;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
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

export default placeSlice.reducer;

export const { resetSuccess } = placeSlice.actions;
