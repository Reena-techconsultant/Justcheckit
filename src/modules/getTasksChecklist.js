import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const tasksChecklist = createAsyncThunk('getTarget', async () => {
    return await getAPI(
        `${BASE_URL}data/user-completed-tasks-checklist/?user_id=2&mission_id=1`,
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

export const tasksChecklistSlice = createSlice({
    name: "tasksChecklistSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(tasksChecklist.pending, (state) => {
                state.loading = true;
            })
            .addCase(tasksChecklist.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(tasksChecklist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default tasksChecklistSlice.reducer;
