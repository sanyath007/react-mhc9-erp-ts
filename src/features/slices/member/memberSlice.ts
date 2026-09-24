import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../api';
import { Member } from "../../../types";

interface MemberState {
    member: Member | null;
    members: Member[] | null;
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: MemberState = {
    member: null,
    members: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const getEmployees = createAsyncThunk("member/getEmployees", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getEmployee = createAsyncThunk("member/getEmployee", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/members/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getMembersByEmployee = createAsyncThunk("member/getMembersByEmployee", async (employeeId: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/members/employee/${employeeId}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("member/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/members`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("member/update", async ({ id, data }: { id: number | string, data: any }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/members/${id}`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("member/destroy", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/api/members/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getEmployees.pending, (state) => {
            state.members = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getEmployees.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.members = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getEmployees.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getEmployee.pending, (state) => {
            state.member = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getEmployee.fulfilled, (state, { payload }: any) => {
            state.member = payload;
            state.isLoading = false;
        });
        builder.addCase(getEmployee.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getMembersByEmployee.pending, (state) => {
            state.members = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getMembersByEmployee.fulfilled, (state, { payload }: any) => {
            state.members = payload;
            state.isLoading = false;
        });
        builder.addCase(getMembersByEmployee.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(store.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(store.fulfilled, (state, { payload }: any) => {
            const { status, message, member } = payload;
            if (status === 1) {
                state.member = member;
                state.isSuccess = true;
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
        builder.addCase(update.fulfilled, (state, { payload }: any) => {
            console.log(payload);
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(update.rejected, (state, { payload }) => {
            console.log(payload);
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(destroy.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(destroy.fulfilled, (state, { payload }: any) => {
            console.log(payload);
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(destroy.rejected, (state, { payload }) => {
            console.log(payload);
            state.isLoading = false;
            state.error = payload;
        });
    }
});

export default memberSlice.reducer;

export const { resetSuccess } = memberSlice.actions;
