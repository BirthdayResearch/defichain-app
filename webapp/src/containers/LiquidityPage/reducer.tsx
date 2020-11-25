import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  poolshares: [],
  isPoolsharesLoaded: false,
  isLoadingPoolshares: false,
  poolpair: {},
  isLoadingPoolpair: false,
  isPoolpairLoaded: false,
  poolPairList: [],
  isLoadingPoolPairList: false,
  tokenBalanceList: [],
  isLoadingPreparingUTXO: false,
  isLoadingAddingLiquidity: false,
  isLoadingAddPoolLiquidity: false,
  isAddPoolLiquidityLoaded: false,
  addPoolLiquidityHash: '',
  isErrorAddingPoolLiquidity: '',
  isLoadingRefreshUTXOS1: false,
  isLoadingLiquidityRemoved: false,
  isLoadingRefreshUTXOS2: false,
  isLoadingTransferTokens: false,
  isLoadingRemovePoolLiquidity: false,
  isRemovePoolLiquidityLoaded: false,
  removePoolLiquidityHash: '',
  isErrorRemovingPoolLiquidity: '',
  testPoolSwap: '-',
  isLoadingTestPoolSwap: false,
  isTestPoolSwapLoaded: false,
  isErrorTestPoolSwap: '',
  poolSwapHash: '',
  isLoadingPoolSwap: false,
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
    fetchTokenBalanceListRequest(state) {},
    fetchTokenBalanceListSuccess(state, action) {
      state.tokenBalanceList = action.payload;
    },
    fetchTokenBalanceListFailure(state) {},
    addPoolLiquidityRequest(state, action) {
      state.isLoadingAddPoolLiquidity = true;
      state.isLoadingPreparingUTXO = true;
      state.isAddPoolLiquidityLoaded = false;
    },
    addPoolPreparingUTXOSuccess(state, action) {
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
    },
    refreshUTXOS1Success(state) {
      state.isLoadingRefreshUTXOS1 = false;
      state.isLoadingLiquidityRemoved = true;
    },
    liquidityRemovedSuccess(state) {
      state.isLoadingLiquidityRemoved = false;
      state.isLoadingRefreshUTXOS2 = true;
    },
    refreshUTXOS2Success(state) {
      state.isLoadingRefreshUTXOS2 = false;
      state.isLoadingTransferTokens = true;
    },
    transferTokensSuccess(state) {
      state.isLoadingTransferTokens = false;
    },
    removePoolLiquiditySuccess(state, action) {
      state.removePoolLiquidityHash = action.payload;
      state.isLoadingRemovePoolLiquidity = false;
      state.isRemovePoolLiquidityLoaded = true;
    },
    removePoolLiquidityFailure(state, action) {
      state.isErrorRemovingPoolLiquidity = action.payload;
      state.isLoadingRemovePoolLiquidity = false;
      state.isRemovePoolLiquidityLoaded = true;
    },
    fetchTestPoolSwapRequest(state, action) {
      state.isLoadingTestPoolSwap = true;
    },
    fetchTestPoolSwapSuccess(state, action) {
      state.testPoolSwap = action.payload;
      state.isLoadingTestPoolSwap = false;
      state.isTestPoolSwapLoaded = true;
    },
    fetchTestPoolSwapFailure(state, action) {
      state.testPoolSwap = '';
      state.isLoadingTestPoolSwap = false;
      state.isTestPoolSwapLoaded = true;
      state.isErrorTestPoolSwap = action.payload;
    },
    poolSwapRequest(state, action) {
      state.isLoadingPoolSwap = true;
      state.isPoolSwapLoaded = false;
    },
    poolSwapSuccess(state, action) {
      state.poolSwapHash = action.payload;
      state.isLoadingPoolSwap = false;
      state.isPoolSwapLoaded = true;
    },
    poolSwapFailure(state, action) {
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
  addPoolLiquiditySuccess,
  addPoolLiquidityFailure,
  removePoolLiqudityRequest,
  removePoolLiquiditySuccess,
  removePoolLiquidityFailure,
  refreshUTXOS1Success,
  liquidityRemovedSuccess,
  refreshUTXOS2Success,
  transferTokensSuccess,
  fetchTestPoolSwapRequest,
  fetchTestPoolSwapSuccess,
  fetchTestPoolSwapFailure,
  poolSwapRequest,
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
