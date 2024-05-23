import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';

export const getUserUpdate = createAsyncThunk('getUserUpdate', async () => {
    return await getAPI(
         `${BASE_URL}account/users/?is_active=False`,
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

export const getUserUpdateSlice = createSlice({
    name: "getUserUpdateSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserUpdate.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getUserUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getUserUpdateSlice.reducer;
