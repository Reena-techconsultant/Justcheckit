import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const missionTask = createAsyncThunk('missionTask', async dispatch => {
    return await uploadImageAPI(
        `${BASE_URL}data/mission-tasks/`,
        dispatch,
    )
        .then(async response => {
            const { data } = response;
            console.log('value', response);
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


export const missionTaskSlice = createSlice({
    name: "missionTaskSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(missionTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(missionTask.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(missionTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default missionTaskSlice.reducer;
