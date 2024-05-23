import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postAPI, uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const confirmSlice = createAsyncThunk('confirmSlice', async dispatch => {
    return await postAPI(
      `${BASE_URL}account/reset-password/`,
        dispatch,
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


export const setPassword = createSlice({
    name: "setPassword",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(confirmSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(confirmSlice.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(confirmSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default setPassword.reducer;
