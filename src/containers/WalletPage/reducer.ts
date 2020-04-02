import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "wallet",
  initialState: {
    isLoading: false
  },
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    }
  }
});

const { actions, reducer } = configSlice;

export const { setLoading } = actions;

export default reducer;
