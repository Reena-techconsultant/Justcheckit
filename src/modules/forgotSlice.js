import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postCreate, uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const forgot = createAsyncThunk('forgot', async dispatch => {
    return await postCreate(
        `${BASE_URL}account/request-password-reset/`,
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


export const onForgot = createSlice({
    name: "forgot",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(forgot.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgot.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(forgot.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default onForgot.reducer;
