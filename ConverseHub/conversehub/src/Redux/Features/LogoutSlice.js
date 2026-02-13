import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

export const LogoutUser = createAsyncThunk(
    'logout/LogoutUser',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v1/users/logout`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const LogoutSlice = createSlice({
    name: 'logout',
    initialState: {
        error: null,
        loading: false,
        User: localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')) : {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(LogoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.User = action.payload.data[0];
                localStorage.setItem('User', JSON.stringify(action.payload.data[0]));
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default LogoutSlice.reducer;