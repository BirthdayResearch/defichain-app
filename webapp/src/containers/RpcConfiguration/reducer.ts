import { createSlice } from '@reduxjs/toolkit';
import { CONFIG_DISABLED, CONFIG_ENABLED } from '@defi_types/rpcConfig';
import { MAIN, TEST } from '../../constants';
import { AppState } from './types';
import { MasterNodeObject } from '../MasternodesPage/masterNodeInterface';

export const initialState: AppState = {
  isFetching: false,
  rpcRemotes: [],
  rpcConfig: { rpcauth: '', rpcconnect: '' },
  isRunning: false,
  rpcConfigError: '',
  nodeError: '',
  isQueueReady: false,
  isAppClosing: false,
  activeNetwork: 'main',
};

const updateConfiguration = (state, config) => {
  state.rpcConfig = {
    ...config,
  };
  const { testnet } = state.rpcConfig;
  state.activeNetwork = testnet === CONFIG_ENABLED ? TEST : MAIN;
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
        const { rpcuser, rpcpassword } = state.rpcRemotes[0];
        const config = {
          ...state.rpcRemotes[0],
          rpcauth: `${rpcuser}:${rpcpassword}`,
        };
        updateConfiguration(state, config);
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
      updateConfiguration(state, action.payload);
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
      const activeNetwork = state.rpcConfig[state.activeNetwork];
      const mnList: string[] = activeNetwork.masternode_operator || [];
      const mn: MasterNodeObject = action.payload;
      const operatorAddress = mn.operatorAuthAddress;
      activeNetwork.masternode_operator = mnList.filter(
        (s: string) => s !== operatorAddress
      );
      if (mn.isEnabled) {
        activeNetwork.masternode_operator.push(operatorAddress);
      }

      if (activeNetwork.masternode_operator?.length === 0 && !mn.isEnabled) {
        activeNetwork.spv = CONFIG_DISABLED;
        activeNetwork.gen = CONFIG_DISABLED;
      } else {
        activeNetwork.spv = CONFIG_ENABLED;
        activeNetwork.gen = CONFIG_ENABLED;
      }
    },
    updateActiveNetwork(state, action) {
      state.activeNetwork = action.payload;
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
  updateActiveNetwork,
} = actions;

export default reducer;
