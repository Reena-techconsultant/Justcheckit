import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getMission = createAsyncThunk('missionCount', async () => {
        return await getAPI(
            `${BASE_URL}data/mission-type/`,
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

export const getMissionSlice = createSlice({
    name: "getMissionSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMission.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMission.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getMission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getMissionSlice.reducer;
