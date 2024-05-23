import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getAdminTask = createAsyncThunk('getAdminTask', async (data) => {
   
    try {
        const response = await getAPI(`${BASE_URL}data/mission-tasks/?mission=${data}` );
        return response.data;
    } catch (error) {
        console.error
        ('Error in missionCount:', error);
        throw error;
    }
});

export const getAdminTaskSlice = createSlice({
    name: "getTargetSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminTask.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getAdminTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getAdminTaskSlice.reducer;
