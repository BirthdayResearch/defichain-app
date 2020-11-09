import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  poolshares: [],
  isPoolsharesLoaded: false,
  isLoadingPoolshares: false,
  poolPairList: [],
  tokenBalanceList: [],
  isLoadingAddPoolLiquidity: false,
  isAddPoolLiquidityLoaded: false,
  addPoolLiquidityHash: '',
  isErrorAddingPoolLiquidity: '',
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
};

const configSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
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
    fetchPoolPairListRequest(state) {},
    fetchPoolPairListSuccess(state, action) {
      state.poolPairList = action.payload;
    },
    fetchPoolPairListFailure(state) {},
    fetchTokenBalanceListRequest(state) {},
    fetchTokenBalanceListSuccess(state, action) {
      state.tokenBalanceList = action.payload;
    },
    fetchTokenBalanceListFailure(state) {},
    addPoolLiquidityRequest(state, action) {
      state.isLoadingAddPoolLiquidity = true;
      state.isAddPoolLiquidityLoaded = false;
    },
    addPoolLiquiditySuccess(state, action) {
      state.addPoolLiquidityHash = action.payload;
      state.isLoadingAddPoolLiquidity = false;
      state.isAddPoolLiquidityLoaded = true;
    },
    addPoolLiquidityFailure(state, action) {
      state.isErrorAddingPoolLiquidity = action.payload;
      state.isLoadingAddPoolLiquidity = false;
      state.isAddPoolLiquidityLoaded = true;
    },
    removePoolLiqudityRequest(state, action) {
      state.isLoadingRemovePoolLiquidity = true;
      state.isRemovePoolLiquidityLoaded = false;
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
  },
});

const { actions, reducer } = configSlice;

export const {
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
  fetchTestPoolSwapRequest,
  fetchTestPoolSwapSuccess,
  fetchTestPoolSwapFailure,
  poolSwapRequest,
  poolSwapSuccess,
  poolSwapFailure,
} = actions;

export default reducer;
