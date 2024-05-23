import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const friendsList = createAsyncThunk('friendsList', async () => {
    try {
        const response = await getAPI(`${BASE_URL}data/user-friend/`);

        const { data } = response;
        return data;
    } catch (error) {
        console.log(error);
        if (error.response) {
            console.log('API issue', error.response);
        } else if (error.request) {
            console.log('API issue', error.response);
        } else {
            console.log('API issue', error.response);
        }
        throw error;
    }
});


export const friendsSLice = createSlice({
    name: "friendsSLice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(friendsList.pending, (state) => {
                state.loading = true;
            })
            .addCase(friendsList.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(friendsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default friendsSLice.reducer;
