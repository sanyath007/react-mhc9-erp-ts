import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../../api';
import { Loan } from "../../../types";

interface LoanState {
    loan: Loan | null;
    loans: Loan[];
    pager: any;
    isLoading: boolean;
    isSuccess: boolean;
    isUploaded: boolean;
    isDeleted: boolean;
    error: any;
}

const initialState: LoanState = {
    loan: null,
    loans: [],
    pager: null,
    isLoading: false,
    isSuccess: false,
    isUploaded: false,
    isDeleted: false,
    error: null
};

export const getLoans = createAsyncThunk("loan/getLoans", async ({ url }: { url: string }, { rejectWithValue }) => {
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getLoan = createAsyncThunk("loan/getLoan", async (id: number | string, { rejectWithValue }) => {
    try {
        const res = await api.get(`/api/loans/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const store = createAsyncThunk("loan/store", async (data: any, { rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loans`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const update = createAsyncThunk("loan/update", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loans/${id}/update`, data);
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const destroy = createAsyncThunk("loan/destroy", async (id: number | string, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loans/${id}/delete`, {});
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const upload = createAsyncThunk("loan/upload", async ({ id, data }: { id: number | string, data: any }, { dispatch, rejectWithValue }) => {
    try {
        const res = await api.post(`/api/loans/${id}/upload`, data);
        dispatch(updateImage(res.data?.img_url));
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        resetDeleted: (state) => {
            state.isDeleted = false;
        },
        resetUploaded: (state) => {
            state.isUploaded = false;
        },
        updateImage: (state, { payload }: PayloadAction<string>) => {
            if (state.loan) {
                state.loan = { ...state.loan, img_url: payload };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLoans.pending, (state) => {
            state.loans = [];
            state.pager = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getLoans.fulfilled, (state, { payload }: any) => {
            const { data, ...pager } = payload;
            state.loans = data;
            state.pager = pager;
            state.isLoading = false;
        });
        builder.addCase(getLoans.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
        });
        builder.addCase(getLoan.pending, (state) => {
            state.loan = null;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getLoan.fulfilled, (state, { payload }: any) => {
            state.loan = payload;
            state.isLoading = false;
        });
        builder.addCase(getLoan.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.error = payload;
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
            const { status, message } = payload;
            if (status === 1) {
                state.isSuccess = true;
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

export default loanSlice.reducer;

export const { resetSuccess, resetDeleted, resetUploaded, updateImage } = loanSlice.actions;
