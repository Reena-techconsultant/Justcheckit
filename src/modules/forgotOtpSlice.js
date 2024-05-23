import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postCreate, uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const passwordResetOtp = createAsyncThunk('passwordResetOtp', async dispatch => {
  return await postCreate(
    `${BASE_URL}account/verify-password-reset-otp/`,
    dispatch,
  )
    .then(async response => {
      const { data } = response;
      console.log('otp response', response);
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


export const ResetOtp = createSlice({
  name: "ResetOtp",
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(passwordResetOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(passwordResetOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(passwordResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default ResetOtp.reducer;
