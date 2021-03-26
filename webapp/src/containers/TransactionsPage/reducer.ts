import { createSlice } from '@reduxjs/toolkit';
import { defaultWalletMap, TransactionState } from './types';

export const initialState: TransactionState = {
  accountTokens: [],
  isAccountTokensLoaded: false,
  isAccountLoadingTokens: false,
  accountHistoryCount: '',
  accountHistoryCountLoaded: false,
  accountHistoryCountLoading: false,
  minBlockHeight: 0,
  maxBlockData: {},
  tokens: [],
  isTokensLoaded: false,
  isLoadingTokens: false,
  walletBalance: 0,
  isBalanceFetching: false,
  isBalanceError: '',
  utxoDfi: 0,
  isUtxoDfiFetching: false,
  isUtxoDfiError: '',
  pendingBalance: 0,
  isPendingBalanceFetching: false,
  isPendingBalanceError: '',
  paymentRequests: [],
  walletTxns: [],
  walletTxnCount: 0,
  isWalletTxnsLoading: false,
  totalFetchedTxns: [],
  walletPageCounter: 1,
  stopPagination: false,
  blockChainInfo: {},
  receivedData: {
    amountToReceive: '',
    amountToReceiveDisplayed: 0,
    receiveMessage: '',
    showBackdrop: '',
    receiveStep: 'default',
  },
  sendData: {
    walletBalance: 0,
    amountToSend: '',
    amountToSendDisplayed: 0,
    toAddress: '',
    scannerOpen: false,
    flashed: '',
    showBackdrop: '',
    sendStep: 'default',
    waitToSend: 5,
  },
  isWalletCreating: false,
  isErrorCreatingWallet: '',
  isWalletRestoring: false,
  isErrorRestoringWallet: '',
  isWalletCreatedFlag: false,
  listAccountHistoryData: {
    isLoading: false,
    isError: '',
    data: [],
    stop: false,
  },
  combineAccountHistoryData: {
    isLoading: false,
    isError: '',
    data: [],
  },
  restartCriteria: {
    isLoading: false,
    data: true,
    isError: '',
  },
  walletMap: { ...defaultWalletMap },
  walletMapError: '',
  isWalletEncrypted: false,
  isErrorUnlockWallet: '',
  isWalletUnlocked: false,
  lockedUntil: 0,
};
const configSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchAccountTokensRequest(state) {
      state.isAccountLoadingTokens = true;
    },
    fetchAccountTokensSuccess(state, action) {
      state.accountTokens = action.payload.accountTokens;
      state.isAccountLoadingTokens = false;
      state.isAccountTokensLoaded = true;
    },
    fetchAccountTokensFailure(state, action) {
      state.accountTokens = [];
      state.isAccountLoadingTokens = false;
      state.isAccountTokensLoaded = true;
    },
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
    fetchTokensRequest(state) {
      state.isLoadingTokens = true;
    },
    fetchTokensSuccess(state, action) {
      state.tokens = action.payload.tokens;
      state.isLoadingTokens = false;
      state.isTokensLoaded = true;
    },
    fetchTokensFailure(state, action) {
      state.tokens = [];
      state.isLoadingTokens = false;
      state.isTokensLoaded = true;
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
    fetchSendDataRequest(state) {},

    fetchWalletBalanceRequest(state) {
      state.isBalanceFetching = true;
      state.isBalanceError = '';
    },
    fetchPendingBalanceSuccess(state, action) {
      state.pendingBalance = action.payload;
      state.isPendingBalanceFetching = false;
    },
    fetchPendingBalanceFailure(state, action) {
      state.walletBalance = 0;
      state.isPendingBalanceFetching = false;
      state.isPendingBalanceError = action.payload;
    },
    stopWalletTxnPagination(state) {
      state.stopPagination = true;
    },
    resetCreateWalletError(state, action) {
      state.isWalletCreating = false;
      state.isErrorCreatingWallet = '';
    },
    resetRestoreWalletError(state, action) {
      state.isWalletRestoring = false;
      state.isErrorRestoringWallet = '';
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
    fetchWalletTokenTransactionsListResetRequest(state) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.isError = '';
      state.listAccountHistoryData.data = [];
    },
    fetchWalletReset(state) {
      state.walletBalance = 0;
      state.accountTokens = [];
      state.isAccountLoadingTokens = false;
      state.isAccountTokensLoaded = false;
      state.tokens = [];
      state.isTokensLoaded = false;
      state.isLoadingTokens = false;
    },
    restoreWalletViaBackupFailure(state, action) {
      state.isWalletRestoring = false;
      state.isErrorRestoringWallet = action.payload;
    },
    startRestoreWalletViaRecent(state, action) {
      state.isWalletRestoring = true;
      state.isErrorRestoringWallet = '';
    },
    startBackupWalletViaExitModal(state) {},
    unlockWalletStart(state, action) {
      state.isErrorUnlockWallet = '';
    },
    unlockWalletSuccess(state, action) {
      state.isWalletUnlocked = action.payload;
    },
    unlockWalletFailure(state, action) {
      state.isWalletUnlocked = false;
      state.isErrorUnlockWallet = action.payload;
    },
    lockWalletStart(state) {
      state.isWalletUnlocked = false;
    },
    enableAutoLockStart(state) {
      state.isWalletUnlocked = false;
      state.lockedUntil = 0;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchAccountTokensRequest,
  fetchAccountTokensSuccess,
  fetchAccountTokensFailure,
  accountHistoryCountRequest,
  accountHistoryCountSuccess,
  accountHistoryCountFailure,
  fetchTokensRequest,
  fetchTokensSuccess,
  fetchTokensFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  fetchSendDataRequest,
  fetchWalletBalanceRequest,
  fetchPendingBalanceSuccess,
  fetchPendingBalanceFailure,
  stopWalletTxnPagination,
  resetCreateWalletError,
  resetRestoreWalletError,
  fetchWalletTokenTransactionsListRequestLoading,
  fetchWalletTokenTransactionsListRequestSuccess,
  fetchWalletTokenTransactionsListRequestFailure,
  fetchWalletTokenTransactionsListRequestStop,
  fetchWalletTokenTransactionsListResetRequest,
  fetchBlockDataForTrxRequestLoading,
  fetchBlockDataForTrxRequestSuccess,
  fetchBlockDataForTrxRequestFailure,
  fetchWalletReset,
  restoreWalletViaBackupFailure,
  startRestoreWalletViaRecent,
  lockWalletStart,
  enableAutoLockStart,
  unlockWalletStart,
  unlockWalletSuccess,
  unlockWalletFailure,
} = actions;

export default reducer;
