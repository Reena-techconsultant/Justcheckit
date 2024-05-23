import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { url } from '../config/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const loginUser = createAsyncThunk('loginUser', async dispatch => {

  return await postAPI(
    `${BASE_URL}account/login/`,
    dispatch,
  )
    .then(async response => {
      const { data } = response;
      console.log('Login', data);
        try {
          if (data.token && data.user_id) {
            await AsyncStorage.setItem('token', data.token.toString());
            await AsyncStorage.setItem('user_id', data.user_id.toString());
            console.log('Data stored successfully.');
          } else {
            console.error('Token or user ID is missing in the response data.');
          }
        } catch (error) {
          console.error('Error storing data:', error);
        }
      if (data.status) {
        console.log('------...', data);
        return data;
      } else {
        return data;
      }
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

const loginUserSlice = createSlice({
  name: "Login",
  initialState: {
    users: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});


export default loginUserSlice.reducer;
