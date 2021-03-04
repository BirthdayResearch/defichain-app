import { createSlice } from '@reduxjs/toolkit';
import { CONFIG_ENABLED } from '@defi_types/rpcConfig';
import { MAIN, TEST } from '../../constants';
import { AppState } from './types';

export const initialState: AppState = {
  isFetching: false,
  rpcRemotes: [],
  rpcConfig: { rpcauth: '', rpcconnect: '' },
  isRunning: false,
  rpcConfigError: '',
  nodeError: '',
  configurationData: {},
  isQueueReady: false,
  isAppClosing: false,
  activeNetwork: 'main',
};

const configSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    getRpcConfigsRequest(state) {
      state.isFetching = true;
    },
    getRpcConfigsSuccess(state, action) {
      state.rpcRemotes = action.payload.remotes;
      if (state.rpcRemotes && state.rpcRemotes.length) {
        const { rpcuser, rpcpassword, testnet } = state.rpcRemotes[0];
        state.activeNetwork = testnet === CONFIG_ENABLED ? TEST : MAIN;
        state.rpcConfig = {
          ...state.rpcRemotes[0],
          rpcauth: `${rpcuser}:${rpcpassword}`,
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
    storeConfigurationData(state, action) {
      state.configurationData = action.payload;
    },
    setQueueReady(state) {
      state.isQueueReady = true;
    },
    killQueue(state) {
      state.isQueueReady = false;
    },
    isAppClosing(state, action) {
      state.isAppClosing = action.payload.isAppClosing;
      state.isFetching = action.payload.isAppClosing;
    },
    startSetNodeVersion(state) {},
    setMasternodesMiningInConf(state, action) {
      state.rpcConfig[state.activeNetwork].spv = action.payload;
      state.rpcConfig[state.activeNetwork].gen = action.payload;
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
  storeConfigurationData,
  setQueueReady,
  killQueue,
  isAppClosing,
  startSetNodeVersion,
  setMasternodesMiningInConf,
} = actions;

export default reducer;
