import { createSlice } from '@reduxjs/toolkit';
import { SwapPageState } from './types';

export const initialState: SwapPageState = {
  poolPairList: [],
  isLoadingPoolPairList: false,
  tokenBalanceList: [],
  isLoadingTokenBalanceList: false,
  isLoadingRefreshUTXOS1: false,
  refreshUTXOS1Loaded: false,
  isLoadingRefreshUTXOS2: false,
  refreshUTXOS2Loaded: false,
  testPoolSwapTo: '-',
  testPoolSwapFrom: '-',
  isLoadingTestPoolSwapTo: false,
  isLoadingTestPoolSwapFrom: false,
  isTestPoolSwapLoadedTo: false,
  isTestPoolSwapLoadedFrom: false,
  isErrorTestPoolSwapTo: '',
  isErrorTestPoolSwapFrom: '',
  poolSwapHash: '',
  isLoadingPoolSwap: false,
  isLoadingRefreshUTXOS: false,
  isLoadingTransferringTokens: false,
  isPoolSwapLoaded: false,
  isErrorPoolSwap: '',
  utxoDfi: 0,
  isUtxoDfiFetching: false,
  isUtxoDfiError: '',
  maxAccountDfi: 0,
  isMaxAccountDfiFetching: false,
  isMaxAccountDfiError: '',
};

const configSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    fetchPoolPairListRequest(state) {
      state.isLoadingPoolPairList = true;
    },
    fetchPoolPairListSuccess(state, action) {
      state.poolPairList = action.payload;
      state.isLoadingPoolPairList = false;
    },
    fetchPoolPairListFailure(state) {
      state.isLoadingPoolPairList = false;
    },
    fetchTokenBalanceListRequest(state) {
      state.isLoadingTokenBalanceList = true;
    },
    fetchTokenBalanceListSuccess(state, action) {
      state.tokenBalanceList = action.payload;
      state.isLoadingTokenBalanceList = false;
    },
    fetchTokenBalanceListFailure(state) {
      state.isLoadingTokenBalanceList = false;
    },
    resetTestPoolSwapRequestTo(state) {
      state.testPoolSwapTo = '';
    },
    fetchTestPoolSwapRequestTo(state, action) {
      state.isLoadingTestPoolSwapTo = true;
      state.isErrorTestPoolSwapTo = '';
      state.isTestPoolSwapLoadedTo = false;
    },
    fetchTestPoolSwapSuccessTo(state, action) {
      state.testPoolSwapTo = action.payload;
      state.isLoadingTestPoolSwapTo = false;
      state.isTestPoolSwapLoadedTo = true;
      state.isErrorTestPoolSwapTo = '';
    },
    fetchTestPoolSwapFailureTo(state, action) {
      state.testPoolSwapTo = '';
      state.isLoadingTestPoolSwapTo = false;
      state.isTestPoolSwapLoadedTo = true;
      state.isErrorTestPoolSwapTo = action.payload;
    },
    resetTestPoolSwapErrorTo(state) {
      state.isErrorTestPoolSwapTo = '';
    },
    resetTestPoolSwapRequestFrom(state) {
      state.testPoolSwapFrom = '';
    },
    fetchTestPoolSwapRequestFrom(state, action) {
      state.isLoadingTestPoolSwapFrom = true;
      state.isErrorTestPoolSwapFrom = '';
      state.isTestPoolSwapLoadedFrom = false;
    },
    fetchTestPoolSwapSuccessFrom(state, action) {
      state.testPoolSwapFrom = action.payload;
      state.isLoadingTestPoolSwapFrom = false;
      state.isTestPoolSwapLoadedFrom = true;
      state.isErrorTestPoolSwapFrom = '';
    },
    fetchTestPoolSwapFailureFrom(state, action) {
      state.testPoolSwapFrom = '';
      state.isLoadingTestPoolSwapFrom = false;
      state.isTestPoolSwapLoadedFrom = true;
      state.isErrorTestPoolSwapFrom = action.payload;
    },
    resetTestPoolSwapErrorFrom(state) {
      state.isErrorTestPoolSwapFrom = '';
    },
    poolSwapRequest(state, action) {
      state.isLoadingPoolSwap = true;
      state.isPoolSwapLoaded = false;
      state.poolSwapHash = '';
      state.isErrorPoolSwap = '';
      state.isLoadingRefreshUTXOS = true;
    },
    poolSwapRefreshUTXOSuccess(state) {
      state.isLoadingRefreshUTXOS = false;
      state.isLoadingTransferringTokens = true;
    },
    poolSwapSuccess(state, action) {
      state.isLoadingTransferringTokens = false;
      state.poolSwapHash = action.payload;
      state.isLoadingPoolSwap = false;
      state.isPoolSwapLoaded = true;
    },
    poolSwapFailure(state, action) {
      state.isLoadingTransferringTokens = false;
      state.isErrorPoolSwap = action.payload;
      state.isLoadingPoolSwap = false;
      state.isPoolSwapLoaded = true;
    },
    fetchUtxoDfiRequest(state) {
      state.isUtxoDfiFetching = true;
      state.isUtxoDfiError = '';
    },
    fetchUtxoDfiSuccess(state, action) {
      state.utxoDfi = action.payload;
      state.isUtxoDfiFetching = false;
      state.isUtxoDfiError = '';
    },
    fetchUtxoDfiFailure(state, action) {
      state.utxoDfi = 0;
      state.isUtxoDfiFetching = false;
      state.isUtxoDfiError = action.payload;
    },
    fetchMaxAccountDfiRequest(state) {
      state.isMaxAccountDfiFetching = true;
      state.isMaxAccountDfiError = '';
    },
    fetchMaxAccountDfiSuccess(state, action) {
      state.maxAccountDfi = action.payload;
      state.isMaxAccountDfiFetching = false;
      state.isMaxAccountDfiError = '';
    },
    fetchMaxAccountDfiFailure(state, action) {
      state.maxAccountDfi = 0;
      state.isMaxAccountDfiFetching = false;
      state.isMaxAccountDfiError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchPoolPairListRequest,
  fetchPoolPairListSuccess,
  fetchPoolPairListFailure,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchTokenBalanceListFailure,
  resetTestPoolSwapRequestTo,
  fetchTestPoolSwapRequestTo,
  fetchTestPoolSwapSuccessTo,
  fetchTestPoolSwapFailureTo,
  resetTestPoolSwapErrorTo,
  resetTestPoolSwapRequestFrom,
  fetchTestPoolSwapRequestFrom,
  fetchTestPoolSwapSuccessFrom,
  fetchTestPoolSwapFailureFrom,
  resetTestPoolSwapErrorFrom,
  poolSwapRequest,
  poolSwapRefreshUTXOSuccess,
  poolSwapSuccess,
  poolSwapFailure,
  fetchUtxoDfiRequest,
  fetchUtxoDfiSuccess,
  fetchUtxoDfiFailure,
  fetchMaxAccountDfiRequest,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} = actions;

export default reducer;
