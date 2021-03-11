import { createSlice } from '@reduxjs/toolkit';
import { LiquidityPageState } from './types';

export const initialState: LiquidityPageState = {
  poolshares: [],
  isPoolsharesLoaded: false,
  isLoadingPoolshares: false,
  poolpair: {},
  isLoadingPoolpair: false,
  isPoolpairLoaded: false,
  poolPairList: [],
  isLoadingPoolPairList: false,
  tokenBalanceList: [],
  isLoadingTokenBalanceList: false,
  isLoadingPreparingUTXO: false,
  isLoadingAddingLiquidity: false,
  isLoadingAddPoolLiquidity: false,
  isAddPoolLiquidityLoaded: false,
  addPoolLiquidityHash: '',
  isErrorAddingPoolLiquidity: '',
  isLoadingRefreshUTXOS1: false,
  refreshUTXOS1Loaded: false,
  isLoadingLiquidityRemoved: false,
  liquidityRemovedLoaded: false,
  isLoadingRefreshUTXOS2: false,
  refreshUTXOS2Loaded: false,
  isLoadingTransferTokens: false,
  transferTokensLoaded: false,
  isLoadingRemovePoolLiquidity: false,
  isRemovePoolLiquidityLoaded: false,
  removePoolLiquidityHash: '',
  isErrorRemovingPoolLiquidity: '',
  utxoDfi: 0,
  isUtxoDfiFetching: false,
  isUtxoDfiError: '',
  maxAccountDfi: 0,
  isMaxAccountDfiFetching: false,
  isMaxAccountDfiError: '',
};

const configSlice = createSlice({
  name: 'liquidity',
  initialState,
  reducers: {
    fetchPoolpair(state, action) {
      state.isLoadingPoolpair = true;
    },
    fetchPoolpairSuccess(state, action) {
      state.poolpair = action.payload.poolpair;
      state.isLoadingPoolpair = false;
      state.isPoolpairLoaded = true;
    },
    fetchPoolpairFailure(state, action) {
      state.poolpair = {};
      state.isLoadingPoolpair = false;
      state.isPoolpairLoaded = true;
    },
    fetchPoolsharesRequest(state) {
      state.isLoadingPoolshares = true;
    },
    fetchPoolsharesSuccess(state, action) {
      state.poolshares = action.payload.poolshares;
      state.isLoadingPoolshares = false;
      state.isPoolsharesLoaded = true;
    },
    fetchPoolsharesFailure(state) {
      state.poolshares = [];
      state.isLoadingPoolshares = false;
      state.isPoolsharesLoaded = true;
    },
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
    addPoolLiquidityRequest(state, action) {
      state.isLoadingAddPoolLiquidity = true;
      state.isLoadingPreparingUTXO = true;
      state.isAddPoolLiquidityLoaded = false;
      state.isErrorAddingPoolLiquidity = '';
      state.addPoolLiquidityHash = '';
    },
    addPoolPreparingUTXOSuccess(state) {
      state.isLoadingPreparingUTXO = false;
      state.isLoadingAddingLiquidity = true;
      state.isAddPoolLiquidityLoaded = false;
    },
    addPoolLiquiditySuccess(state, action) {
      state.addPoolLiquidityHash = action.payload;
      state.isLoadingAddingLiquidity = false;
      state.isLoadingAddPoolLiquidity = false;
      state.isAddPoolLiquidityLoaded = true;
    },
    addPoolLiquidityFailure(state, action) {
      state.isErrorAddingPoolLiquidity = action.payload;
      state.isLoadingAddingLiquidity = false;
      state.isLoadingAddPoolLiquidity = false;
      state.isAddPoolLiquidityLoaded = true;
    },
    removePoolLiqudityRequest(state, action) {
      state.isLoadingRemovePoolLiquidity = true;
      state.isLoadingRefreshUTXOS1 = true;
      state.isRemovePoolLiquidityLoaded = false;
      state.refreshUTXOS1Loaded = false;
      state.liquidityRemovedLoaded = false;
      state.refreshUTXOS2Loaded = false;
      state.transferTokensLoaded = false;
      state.isErrorRemovingPoolLiquidity = '';
      state.removePoolLiquidityHash = '';
    },
    refreshUTXOS1Success(state) {
      state.refreshUTXOS1Loaded = true;
      state.isLoadingRefreshUTXOS1 = false;
      state.isLoadingLiquidityRemoved = true;
    },
    liquidityRemovedSuccess(state) {
      state.liquidityRemovedLoaded = true;
      state.isLoadingLiquidityRemoved = false;
      state.isLoadingRefreshUTXOS2 = true;
    },
    refreshUTXOS2Success(state) {
      state.refreshUTXOS2Loaded = true;
      state.isLoadingRefreshUTXOS2 = false;
      state.isLoadingTransferTokens = true;
    },
    transferTokensSuccess(state) {
      state.transferTokensLoaded = true;
      state.isLoadingTransferTokens = false;
    },
    removePoolLiquiditySuccess(state, action) {
      state.removePoolLiquidityHash =
        action.payload?.txId1 ?? action.payload?.txId2;
      state.isLoadingRemovePoolLiquidity = false;
      state.isRemovePoolLiquidityLoaded = true;
    },
    removePoolLiquidityFailure(state, action) {
      state.isErrorRemovingPoolLiquidity = action.payload;
      state.isLoadingRemovePoolLiquidity = false;
      state.isRemovePoolLiquidityLoaded = true;
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
  fetchPoolpair,
  fetchPoolpairSuccess,
  fetchPoolpairFailure,
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolsharesFailure,
  fetchPoolPairListRequest,
  fetchPoolPairListSuccess,
  fetchPoolPairListFailure,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchTokenBalanceListFailure,
  addPoolLiquidityRequest,
  addPoolPreparingUTXOSuccess,
  addPoolLiquiditySuccess,
  addPoolLiquidityFailure,
  removePoolLiqudityRequest,
  removePoolLiquiditySuccess,
  removePoolLiquidityFailure,
  refreshUTXOS1Success,
  liquidityRemovedSuccess,
  refreshUTXOS2Success,
  transferTokensSuccess,
  fetchUtxoDfiRequest,
  fetchUtxoDfiSuccess,
  fetchUtxoDfiFailure,
  fetchMaxAccountDfiRequest,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} = actions;

export default reducer;
