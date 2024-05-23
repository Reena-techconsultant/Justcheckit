import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getFeatureAdminTask = createAsyncThunk('getFeatureAdminTask', async (data) => {

    try {
        const response = await getAPI(`${BASE_URL}data/mission-tasks/?mission=${data}` );
        return response.data;
    } catch (error) {
        console.error
        ('Error in missionCount:', error);
        throw error;
    }
});

export const getFeaturesAdminTaskSlice = createSlice({
    name: "getTargetSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureAdminTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFeatureAdminTask.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getFeatureAdminTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getFeaturesAdminTaskSlice.reducer;
