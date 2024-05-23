import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const LeaderboardSlice = createAsyncThunk('Leaderboard', async () => {
    return await getAPI(
       `${BASE_URL}data/leaderboard-by-mission/?mission=1`
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

export const getLeaderSlice = createSlice({
    name: "getLeaderSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(LeaderboardSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(LeaderboardSlice.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(LeaderboardSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getLeaderSlice.reducer;
