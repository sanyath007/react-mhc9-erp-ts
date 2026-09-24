import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { User, PaginatedResponse } from "../../../types";

interface UserState {
    users: User[];
    user: User | null;
    pager: any;
    error: any;
    isLoading: boolean;
    isSuccess: boolean;
    isDeleted: boolean;
}

const initialState: UserState = {
    users: [],
    user: null,
    pager: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isDeleted: false,
};

export const getUsers = createAsyncThunk("user/getUsers", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getUser = createAsyncThunk("user/getUser", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/users/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("user/store", async (data: any, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/users`, data);
        dispatch(getUsers({ url: `/api/users` }));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("user/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/users/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("user/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/users/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const activate = createAsyncThunk("user/activate", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/users/${id}/send-mail`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUsers.pending, (state) => {
            state.users = [];
            state.pager = null;
            state.isLoading = true;
        });
        builder.addCase(getUsers.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.users = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getUsers.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getUser.pending, (state) => {
            state.user = null;
            state.isLoading = true;
        });
        builder.addCase(getUser.fulfilled, (state, { payload }) => {
            state.user = payload;
            state.isLoading = false;
        });
        builder.addCase(getUser.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isSuccess = false;
            state.user = null;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, user } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.user = user;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(store.rejected, (state, { payload }) => {
            state.error = payload;
        });
        builder.addCase(update.pending, (state) => {
            state.isSuccess = false;
            state.user = null;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            const { status, message, user } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.user = user;
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
        builder.addCase(activate.pending, (state) => {
            state.isSuccess = false;
            state.user = null;
            state.error = null;
        });
        builder.addCase(activate.fulfilled, (state, { payload }: any) => {
            const { status, message, user } = payload;
            if (status === 1) {
                state.isSuccess = true;
                state.user = user;
            } else {
                state.error = { message };
            }
        });
        builder.addCase(activate.rejected, (state, { payload }) => {
            state.error = payload;
        });
    }
});

export default userSlice.reducer;

export const { resetSuccess, resetDeleted } = userSlice.actions;
