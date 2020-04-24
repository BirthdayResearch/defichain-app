import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "app",
  initialState: {
    isFetching: false,
    rpcConfig: {},
    isNodeRunning: false,
    rpcConfigError: "",
    nodeError: "",
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
    startNodeRequest(state) {
      state.isFetching = true;
    },
    startNodeSuccess(state) {
      state.isNodeRunning = true;
      state.isFetching = false;
      state.rpcConfigError = "";
    },
    startNodeFailure(state, action) {
      state.isFetching = false;
      state.isNodeRunning = false;
      state.nodeError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
  startNodeRequest,
  startNodeSuccess,
  startNodeFailure,
} = actions;

export default reducer;
