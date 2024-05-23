
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const searchMission = createAsyncThunk('searchMission', async (name) => {
    return await getAPI(
        `${BASE_URL}data/my-missions/?name=${name}`,
        
    )
    
        .then(async response => {
            const { data } = response;
console.log(data,"data...............");
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


export const searchMissionSlice = createSlice({
    name: "searchMissionSlice",
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
            .addCase(searchMission.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchMission.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(searchMission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { storeMissionSearch } = searchMissionSlice.actions;

export default searchMissionSlice.reducer;
