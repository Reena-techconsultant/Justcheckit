import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const missionDetail = createAsyncThunk('missionDetail', async dispatch => {
    return await uploadImageAPI(
        `${BASE_URL}/data/missions-upload/`,
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


export const missionDetailUpload = createSlice({
    name: "missionDetailUpload",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(missionDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(missionDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(missionDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default missionDetailUpload.reducer;
