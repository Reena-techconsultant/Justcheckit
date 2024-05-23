import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getUserMissions = createAsyncThunk('getUserMissions', async () => {
    return await getAPI(
        `${BASE_URL}data/user-missions/`,
    )
        .then(async response => {
            const { data } = response;

            return data;
        })
        .catch(e => {
            console.log(e);
            if (e.response) {
                console.log('api issue', e.response);
            } else if (e.request) {
                console.log('api issue', e.response);
            } else {
                console.log('api issue', e.response);
            }
        });
});

export const getUserMissionsSlice = createSlice({
    name: "getUserMissionsSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserMissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserMissions.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getUserMissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getUserMissionsSlice.reducer;
