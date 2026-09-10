import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import jwt from "jwt-decode";
import api from "../../../api";
import { User } from "../../../types";

const accessToken = localStorage.getItem("access_token");

interface AuthState {
    loggedInUser: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    error: any;
}

const initialState: AuthState = {
    loggedInUser: null,
    isLoggedIn: accessToken ? true : false,
    isLoading: false,
    isSuccess: false,
    error: null
};

export const login = createAsyncThunk("auth/login", async (credentials: any, { rejectWithValue }) => {
    try {
        const res = await api.post('/api/auth/login', credentials);
    
        return res.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            state.isSuccess = false;
        },
        setLoggedInUser: (state, { payload }) => {
            state.loggedInUser = payload;
        },
        logout: (state) => {
            state.loggedInUser = null;
            state.isLoggedIn = false;
            localStorage.removeItem("access_token");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loggedInUser = null;
            state.isLoggedIn = false;
            state.isLoading = true;
            state.isSuccess = false;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            if (action?.payload) {
                const { access_token } = action?.payload;
                // const decode = jwt(access_token);

                localStorage.setItem("access_token", access_token);

                // state.loggedInUser = decode.sub;
                state.isLoggedIn = true;
                state.isSuccess = true;
            } else {
                state.error = { message: 'Invalid username or password' }
            }

            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state, { payload }) => {
            state.error = payload;
            state.isLoading = false;
        });
    }
});

export default authSlice.reducer;

export const { resetSuccess, setLoggedInUser, logout } = authSlice.actions;
