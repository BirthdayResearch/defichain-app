import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "app",
  initialState: {
    isFetching: false,
    rpcConfig: {
      remotes: [],
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
      if (
        state.rpcConfig &&
        state.rpcConfig.remotes &&
        state.rpcConfig.remotes.length
      ) {
        const { rpcconnect, rpcport } = state.rpcConfig.remotes[0];
        state.rpcAuth = "defi:x64656669"; /*TODO : decode password using hash*/
        state.rpcConnect = rpcconnect;
        state.rpcPort = rpcport;
      }
      state.isFetching = false;
      state.rpcConfigError = "";
    },
    getRpcConfigsFailure(state, action) {
      state.isFetching = false;
      state.rpcConfig = {
        remotes: [],
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
