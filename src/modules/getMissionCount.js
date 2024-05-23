import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const missionCount = createAsyncThunk('missionCount', async (mission_name) => {
    const value = await AsyncStorage.getItem('user_id');
   
    try {
        const response = await getAPI(`${BASE_URL}data/mission_tasks_get/?mission_name=${mission_name}` );
        return response.data;
    } catch (error) {
        console.error
        ('Error in missionCount:', error);
        throw error;
    }
});

export const missionCountSlice = createSlice({
    name: "missionCountSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {
        storeImageData: (state, action) => {
            console.log('Action dispatched:', action);

            state.images = action.payload.data;
            console.log('Action dispatched:', action);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(missionCount.pending, (state) => {
                state.loading = true;
            })
            .addCase(missionCount.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(missionCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
export const { storeImageData } = missionCountSlice.actions;
export default missionCountSlice.reducer;
