import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const missionType = createAsyncThunk('missionType', async dispatch => {
    return await uploadImageAPI(
        `${BASE_URL}data/mission-type/?is_active=False`,
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


export const onMissionType = createSlice({
    name: "onMissionType",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(missionType.pending, (state) => {
                state.loading = true;
            })
            .addCase(missionType.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(missionType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default onMissionType.reducer;
