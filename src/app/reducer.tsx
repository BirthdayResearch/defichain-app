import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "app",
  initialState: {
    isFetching: false,
    rpcConfig: {},
    rpcConfigError: "",
  },
  reducers: {
    getRpcConfigsRequest(state) {
      state.isFetching = true;
    },
    getRpcConfigsSuccess(state, action) {
      state.rpcConfig = action.payload;
      state.isFetching = false;
      state.rpcConfigError = "";
    },
    getRpcConfigsFailure(state, action) {
      state.isFetching = false;
      state.rpcConfig = {};
      state.rpcConfigError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
} = actions;

export default reducer;
