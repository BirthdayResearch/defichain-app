import { createSlice } from '@reduxjs/toolkit';
import { defaultWalletMap, TransactionState } from './types';

export const initialState: TransactionState = {
  accountTokens: [],
  accountHistoryCount: '',
  accountHistoryCountLoaded: false,
  accountHistoryCountLoading: false,
  listAccountHistoryData: {
    isLoading: false,
    isError: '',
    data: [],
    stop: false,
  },
  minBlockHeight: 0,
  maxBlockData: {},
  combineAccountHistoryData: {
    isLoading: false,
    isError: '',
    data: [],
  },
  isWalletTxnsLoading: false,
  walletTxns: [],
  totalFetchedTxns: [],
  walletTxnCount: 0,
  walletPageCounter: 1,
  stopPagination: false,
};

const configSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    accountHistoryCountRequest(state, action) {
      state.accountHistoryCount = '';
    },
    accountHistoryCountSuccess(state, action) {
      state.accountHistoryCount = action.payload.accountHistoryCount;
      state.accountHistoryCountLoading = false;
      state.accountHistoryCountLoaded = true;
    },
    accountHistoryCountFailure(state, action) {
      state.accountTokens = [];
      state.accountHistoryCountLoading = false;
      state.accountHistoryCountLoaded = true;
    },
    fetchSendDataRequest(state) {},

    stopWalletTxnPagination(state) {
      state.stopPagination = true;
    },
    fetchWalletTokenTransactionsListRequestLoading(state, action) {
      state.listAccountHistoryData.isLoading = true;
      state.listAccountHistoryData.isError = '';
      state.listAccountHistoryData.data = [];
    },
    fetchWalletTokenTransactionsListRequestSuccess(state, action) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.isError = '';
      state.listAccountHistoryData.data = action.payload.data;
      state.minBlockHeight = action.payload.minBlockHeight;
      state.maxBlockData = action.payload.maxBlockData;
    },
    fetchWalletTokenTransactionsListRequestFailure(state, action) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.isError = action.payload;
      state.listAccountHistoryData.data = [];
    },
    fetchWalletTokenTransactionsListRequestStop(state) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.stop = true;
    },
    fetchWalletTokenTransactionsListResetRequest(state) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.isError = '';
      state.listAccountHistoryData.data = [];
    },
    fetchBlockDataForTrxRequestLoading(state, action) {
      state.combineAccountHistoryData.isLoading = true;
      state.combineAccountHistoryData.data = [];
      state.combineAccountHistoryData.isError = action.payload;
    },
    fetchBlockDataForTrxRequestSuccess(state, action) {
      state.combineAccountHistoryData.isLoading = false;
      state.combineAccountHistoryData.data = action.payload;
      state.combineAccountHistoryData.isError = '';
    },
    fetchBlockDataForTrxRequestFailure(state, action) {
      state.combineAccountHistoryData.isLoading = false;
      state.combineAccountHistoryData.data = [];
      state.combineAccountHistoryData.isError = action.payload;
    },
    fetchWalletTxnsRequest(state, action) {
      state.isWalletTxnsLoading = true;
    },
    fetchWalletTxnsSuccess(state, action) {
      state.walletTxns = action.payload.walletTxns;
      state.totalFetchedTxns = action.payload.totalFetchedTxns;
      state.walletTxnCount = action.payload.walletTxnCount;
      state.walletPageCounter = action.payload.walletPageCounter;
      state.isWalletTxnsLoading = false;
      state.stopPagination = false;
    },
    fetchWalletTxnsFailure(state, action) {
      state.walletTxns = [];
      state.isWalletTxnsLoading = false;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  accountHistoryCountRequest,
  accountHistoryCountSuccess,
  accountHistoryCountFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  fetchSendDataRequest,
  stopWalletTxnPagination,
  fetchWalletTokenTransactionsListRequestLoading,
  fetchWalletTokenTransactionsListRequestSuccess,
  fetchWalletTokenTransactionsListRequestFailure,
  fetchWalletTokenTransactionsListRequestStop,
  fetchWalletTokenTransactionsListResetRequest,
  fetchBlockDataForTrxRequestLoading,
  fetchBlockDataForTrxRequestSuccess,
  fetchBlockDataForTrxRequestFailure,
} = actions;

export default reducer;
