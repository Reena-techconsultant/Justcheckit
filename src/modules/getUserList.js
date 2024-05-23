import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserList = createAsyncThunk('UserList', async () => {
    const value = await AsyncStorage.getItem('user_id');
    console.log(value,'valueeeeee')
    return await getAPI(
        `${BASE_URL}data/missions/?user=${value}`,
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


export const UserListSlice = createSlice({
    name: "UserListSlice",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UserList.pending, (state) => {
                state.loading = true;
            })
            .addCase(UserList.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(UserList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default UserListSlice.reducer;
