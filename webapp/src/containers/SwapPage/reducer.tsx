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
    addPoolLiquidityRequest(state) {
      state.isLoadingAddPoolLiquidity = true;
      state.isAddPoolLiquidityLoaded = false;
    },
    addPoolLiquiditySuccess(state, action){
      state.addPoolLiquidityHash = action.payload;
      state.isLoadingAddPoolLiquidity = false;
      state.isAddPoolLiquidityLoaded = true;
    },
    addPoolLiquidityFailure(state, action){
      state.isErrorAddingPoolLiquidity = action.payload;
      state.isLoadingAddPoolLiquidity = false;
      state.isAddPoolLiquidityLoaded = true;
    }
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
  addPoolLiquidityFailure
} = actions;

export default reducer;
