import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getMissionTaskSlice = createAsyncThunk('MissionTaskSlice', async () => {
    return await getAPI(
        `${BASE_URL}data/mission-tasks/`,
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

export const getMissionTask = createSlice({
    name: "getMissionTaskSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMissionTaskSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMissionTaskSlice.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getMissionTaskSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getMissionTask.reducer;
