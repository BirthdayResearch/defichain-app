import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "app",
  initialState: {
    isFetching: false,
    rpcConfig: {
      remotes: [{ rpcauth: "", rpcconnect: "", rpcport: "" }],
    },
    rpcAuth: "",
    rpcConnect: "",
    rpcPort: "",
    isRunning: false,
    rpcConfigError: "",
    nodeError: "",
  },
  reducers: {
    getRpcConfigsRequest(state) {
      state.isFetching = true;
    },
    getRpcConfigsSuccess(state, action) {
      state.rpcConfig = action.payload;
      if (state.rpcConfig && state.rpcConfig.remotes) {
        let rpcAuth = state.rpcConfig.remotes[0].rpcauth;
        state.rpcAuth = `${rpcAuth.split(":")[0]}:${
          rpcAuth.split(":")[1].split("$")[1]
        }`;
        state.rpcConnect = state.rpcConfig.remotes[0].rpcconnect;
        state.rpcPort = state.rpcConfig.remotes[0].rpcport;
      }
      state.isFetching = false;
      state.rpcConfigError = "";
    },
    getRpcConfigsFailure(state, action) {
      state.isFetching = false;
      state.rpcConfig = {
        remotes: [{ rpcauth: "", rpcconnect: "", rpcport: "" }],
      };
      state.rpcConfigError = action.payload;
    },
    startNodeRequest(state) {
      state.isFetching = true;
    },
    startNodeSuccess(state) {
      state.isRunning = true;
      state.isFetching = false;
      state.rpcConfigError = "";
    },
    startNodeFailure(state, action) {
      state.isFetching = false;
      state.isRunning = false;
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
