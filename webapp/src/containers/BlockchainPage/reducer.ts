import { createSlice } from '@reduxjs/toolkit';
import { BlockchainState } from './types';

export const initialState: BlockchainState = {
  blocks: [],
  blockCount: 0,
  blockData: {
    nTxns: 0,
    difficulty: 0,
    height: 0,
    bits: '',
    version: 0,
    nonce: 0,
    hash: '',
    merkleRoot: '',
  },
  txns: [],
  txnCount: 0,
  isBlocksLoaded: false,
  isLoadingBlocks: false,
  blocksLoadError: '',
  isLoadingBlockData: false,
  blockDataError: '',
  blockCountError: '',
  isTxnsLoaded: false,
  isLoadingTxns: false,
  txnsLoadError: '',
};

const configSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    fetchBlocksRequest(state, action) {
      state.isLoadingBlocks = true;
    },
    fetchBlocksSuccess(state, action) {
      state.blocks = action.payload.blocks;
      state.blockCount = action.payload.blockCount;
      state.isLoadingBlocks = false;
      state.isBlocksLoaded = true;
    },
    fetchBlocksFailure(state, action) {
      state.blocks = [];
      state.blockCount = 0;
      state.isLoadingBlocks = false;
      state.isBlocksLoaded = true;
    },
    fetchBlockDataRequest(state, action) {
      state.isLoadingBlockData = true;
    },
    fetchBlockDataSuccess(state, action) {
      state.blockData = action.payload.blockData;
      state.isLoadingBlockData = false;
    },
    fetchBlockDataFailure(state, action) {
      state.blockDataError = action.payload;
      state.isLoadingBlockData = false;
    },
    // tslint:disable-next-line: no-empty
    fetchBlockCountRequest(state) {},
    fetchBlockCountSuccess(state, action) {
      state.blockCount = action.payload.blockCount;
    },
    fetchBlockCountFailure(state, action) {
      state.blockCountError = action.payload;
    },
    fetchTxnsRequest(state, action) {
      state.isLoadingTxns = true;
      state.isTxnsLoaded = false;
      state.txnsLoadError = '';
    },
    fetchTxnsSuccess(state, action) {
      state.txns = action.payload.txns;
      state.txnCount = action.payload.txnCount;
      state.isLoadingTxns = false;
      state.isTxnsLoaded = true;
    },
    fetchTxnsFailure(state, action) {
      state.txns = [];
      state.txnCount = 0;
      state.txnsLoadError = action.payload;
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
  fetchBlockDataRequest,
  fetchBlockDataSuccess,
  fetchBlockDataFailure,
  fetchBlockCountRequest,
  fetchBlockCountSuccess,
  fetchBlockCountFailure,
  fetchTxnsRequest,
  fetchTxnsSuccess,
  fetchTxnsFailure,
} = actions;

export default reducer;
