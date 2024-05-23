import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const getDropdown = createAsyncThunk('getDropdown', async () => {
    return await getAPI(
        `${BASE_URL}data/user-missions/`,
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

export const getDropdownSlice = createSlice({
    name: "getDropdownSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDropdown.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDropdown.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(getDropdown.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default getDropdownSlice.reducer;
