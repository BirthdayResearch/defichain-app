import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'app',
  initialState: {
    isFetching: false,
    rpcRemotes: [],
    rpcConfig: { rpcauth: '', rpcconnect: '', rpcport: '' },
    isRunning: false,
    rpcConfigError: '',
    nodeError: '',
  },
  reducers: {
    getRpcConfigsRequest(state) {
      state.isFetching = true;
    },
    getRpcConfigsSuccess(state, action) {
      state.rpcRemotes = action.payload.remotes;
      if (state.rpcRemotes && state.rpcRemotes.length) {
        const {
          rpcuser,
          rpcpassword,
          rpcconnect,
          rpcport,
        } = state.rpcRemotes[0];
        state.rpcConfig = {
          rpcauth: `${rpcuser}:${rpcpassword}`,
          rpcconnect,
          rpcport,
        };
      }
      state.isFetching = false;
      state.rpcConfigError = '';
    },
    getRpcConfigsFailure(state, action) {
      state.isFetching = false;
      state.rpcRemotes = [];
      state.rpcConfig = { rpcauth: '', rpcconnect: '', rpcport: '' };
      state.rpcConfigError = action.payload;
    },
    startNodeRequest(state) {
      state.isFetching = true;
    },
    startNodeSuccess(state) {
      state.isRunning = true;
      state.isFetching = false;
      state.rpcConfigError = '';
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
