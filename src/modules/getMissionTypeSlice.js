import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getmissionType = createAsyncThunk('missionType', async () => {
    return await getAPI(
        `${BASE_URL}data/missions/?name=${search}`,
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

export const getMissionTypeSLice = createSlice({
    name: "getMissionTypeSLice",
    initialState: {
        users: [],
        loading: false,
        error: null,
        data: null,
    },
    reducers: {
        storemissionType: (state, action) => {
            data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getmissionType.pending, (state) => {
                state.loading = true;
            })
            .addCase(getmissionType.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getmissionType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { storemissionType } = getMissionTypeSLice.actions;

export default getMissionTypeSLice.reducer;
