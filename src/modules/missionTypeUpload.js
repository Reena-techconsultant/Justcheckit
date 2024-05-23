import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postCreate, selectImage, uploadImageAPI } from "../config/apiMethods";
import { BASE_URL } from "../config/baseUrl";
export const uploadPhotos = createAsyncThunk('uploadPhotos', async (data) => {
    try {
      const response = await selectImage(`${BASE_URL}data/tasks/`, data);
      return response.data;
    } catch (error) {
      console.error('Error in uploadPhotos async thunk:', error);
      throw error;
    }
  });
  

export const onUpload = createSlice({
    name: "CreateTask",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadPhotos.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadPhotos.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(uploadPhotos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default onUpload.reducer;
