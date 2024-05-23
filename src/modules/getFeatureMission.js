import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAPI } from '../config/apiMethods';
import { BASE_URL } from '../config/baseUrl';

export const featureMissions = createAsyncThunk('featureMissions', async () => {
  try {
    const response = await getAPI(`${BASE_URL}/data/featured-missions/`);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.log('API issue', error.response);
    } else if (error.request) {
      console.log('API issue', error.response);
    } else {
      console.log('API issue', error.response);
    }
    throw error;
  }
});

export const featureMissionSlice = createSlice({
  name: "featureMissionSlice",
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featureMissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(featureMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(featureMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default featureMissionSlice.reducer;
