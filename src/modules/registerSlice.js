import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postCreate, uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const createUser = createAsyncThunk('createUser', async dispatch => {
  return await postCreate(
    `${BASE_URL}account/register/`,   
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
        return e.response
      } else if (e.request) {
        console.log('api issue', e.response);
        return e.response
      } else {
        console.log('api issue', e.response);
         return e.response
      }
    });
});


export const register = createSlice({
  name: "Register",
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default register.reducer;
