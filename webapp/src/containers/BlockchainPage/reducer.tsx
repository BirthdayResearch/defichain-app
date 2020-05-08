import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'blockchain',
  initialState: {
    blocks: [],
    txns: [],
    isBlocksLoaded: false,
    isLoadingBlocks: false,
    blocksLoadError: '',
    isTxnsLoaded: false,
    isLoadingTxns: false,
    TxnsLoadError: '',
  },
  reducers: {
    fetchBlocksRequest(state) {
      state.blocks = [];
      state.isLoadingBlocks = true;
    },
    fetchBlocksSuccess(state, action) {
      state.blocks = action.payload.blocks;
      state.isLoadingBlocks = false;
      state.isBlocksLoaded = true;
    },
    fetchBlocksFailure(state, action) {
      state.blocks = [];
      state.isLoadingBlocks = false;
      state.isBlocksLoaded = true;
    },
    fetchTxnsRequest(state) {
      state.txns = [];
      state.isLoadingTxns = true;
    },
    fetchTxnsSuccess(state, action) {
      state.txns = action.payload.txns;
      state.isLoadingTxns = false;
      state.isTxnsLoaded = true;
    },
    fetchTxnsFailure(state, action) {
      state.txns = [];
      state.isLoadingTxns = false;
      state.isTxnsLoaded = true;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchBlocksRequest,
  fetchBlocksSuccess,
  fetchBlocksFailure,
  fetchTxnsRequest,
  fetchTxnsSuccess,
  fetchTxnsFailure,
} = actions;

export default reducer;
