import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getTarget = createAsyncThunk('getTarget', async (data) => {
  
    try {
        console.log(`${BASE_URL}data/admin-missions/?mission_type=${data}` );
        const response = await getAPI(`${BASE_URL}data/admin-missions/?mission_type=${data}` );
        return response.data;
    } catch (error) {
        console.error
        ('Error in missionCount:', error);
        throw error;
    }
});

export const getTargetSlice = createSlice({
    name: "getTargetSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTarget.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTarget.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getTarget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getTargetSlice.reducer;
