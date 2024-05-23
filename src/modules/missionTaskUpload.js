import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";

export const missionUploadTask = createAsyncThunk('missionUploadTask', async dispatch  => {
  try {
    const authToken = '2aed4486c12b2e598aa86f5444a65e379e35733a';

    const response = await uploadImageAPI(
      `${BASE_URL}data/missions/`,
      null,
      authToken,
      dispatch
    );

    console.log('create List Api response', response);

    const { data} = response;
    console.log('check data from api', response);
    return data;
  } catch (e) {
    console.error('Error:', e);
    throw e;
  }
});
export const missionTaskUpload = createSlice({
    name: "missionTaskUpload",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(missionUploadTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(missionUploadTask.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(missionUploadTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default missionTaskUpload.reducer;
