import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  accountTokens: [],
  isAccountTokensLoaded: false,
  isAccountLoadingTokens: false,
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
  },
  restartCriteria: {
    isLoading: false,
    data: true,
    isError: '',
  },
};
const configSlice = createSlice({
  name: 'wallet',
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
    fetchPaymentRequest(state) {
      state.paymentRequests = [];
    },
    fetchPaymentRequestsSuccess(state, action) {
      state.paymentRequests = action.payload;
    },
    fetchPaymentRequestsFailure(state, action) {
      state.paymentRequests = [];
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
    removeReceiveTxnsRequest(state, action) {},
    removeReceiveTxnsSuccess(state, action) {
      state.paymentRequests = action.payload;
    },
    removeReceiveTxnsFailure(state, action) {},
    addReceiveTxnsRequest(state, action) {},
    addReceiveTxnsSuccess(state, action) {
      state.paymentRequests = action.payload;
    },
    addReceiveTxnsFailure(state, action) {},
    fetchSendDataRequest(state) {},
    fetchSendDataSuccess(state, action) {
      state.sendData = action.payload.data;
    },
    fetchSendDataFailure(state, action) {},
    fetchWalletBalanceRequest(state) {
      state.isBalanceFetching = true;
      state.isBalanceError = '';
    },
    fetchWalletBalanceSuccess(state, action) {
      state.walletBalance = action.payload;
      state.isBalanceFetching = false;
    },
    fetchWalletBalanceFailure(state, action) {
      state.walletBalance = 0;
      state.isBalanceFetching = false;
      state.isBalanceError = action.payload;
    },
    fetchPendingBalanceRequest(state) {
      state.isPendingBalanceFetching = true;
      state.isPendingBalanceError = '';
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
    setBlockChainInfo(state, action) {
      state.blockChainInfo = action.payload;
    },
    createWalletRequest(state, action) {
      state.isWalletCreating = true;
      state.isErrorCreatingWallet = '';
    },
    createWalletSuccess(state) {
      state.isWalletCreating = false;
      state.isErrorCreatingWallet = '';
    },
    createWalletFailure(state, action) {
      state.isWalletCreating = false;
      state.isErrorCreatingWallet = action.payload;
    },
    resetCreateWalletError(state, action) {
      state.isWalletCreating = false;
      state.isErrorCreatingWallet = '';
    },
    restoreWalletRequest(state, action) {
      state.isWalletRestoring = true;
      state.isErrorRestoringWallet = '';
    },
    restoreWalletSuccess(state) {
      state.isWalletRestoring = false;
      state.isErrorRestoringWallet = '';
    },
    restoreWalletFailure(state, action) {
      state.isWalletRestoring = false;
      state.isErrorRestoringWallet = action.payload;
    },
    resetRestoreWalletError(state, action) {
      state.isWalletRestoring = false;
      state.isErrorRestoringWallet = '';
    },
    fetchInstantBalanceRequest(state) {},
    fetchInstantPendingBalanceRequest(state) {},
    setIsWalletCreatedRequest(state, action) {
      state.isWalletCreatedFlag = action.payload;
    },
    setIsWalletCreatedStartRequest(state) {
      state.isWalletCreatedFlag = false;
    },
    fetchWalletTokenTransactionsListRequestLoading(state, action) {
      state.listAccountHistoryData.isLoading = true;
      state.listAccountHistoryData.isError = '';
      state.listAccountHistoryData.data = [];
    },
    fetchWalletTokenTransactionsListRequestSuccess(state, action) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.isError = '';
      state.listAccountHistoryData.data = action.payload;
    },
    fetchWalletTokenTransactionsListRequestFailure(state, action) {
      state.listAccountHistoryData.isLoading = false;
      state.listAccountHistoryData.isError = action.payload;
      state.listAccountHistoryData.data = [];
    },
    checkRestartCriteriaRequestLoading(state) {
      state.restartCriteria.isLoading = true;
      state.restartCriteria.data = true;
      state.restartCriteria.isError = '';
    },
    checkRestartCriteriaRequestSuccess(state, action) {
      state.restartCriteria.isLoading = false;
      state.restartCriteria.data = action.payload;
      state.restartCriteria.isError = '';
    },
    checkRestartCriteriaRequestFailure(state, action) {
      state.restartCriteria.isLoading = false;
      state.restartCriteria.data = true;
      state.restartCriteria.isError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchAccountTokensRequest,
  fetchAccountTokensSuccess,
  fetchAccountTokensFailure,
  fetchTokensRequest,
  fetchTokensSuccess,
  fetchTokensFailure,
  fetchPaymentRequest,
  fetchPaymentRequestsSuccess,
  fetchPaymentRequestsFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  removeReceiveTxnsRequest,
  removeReceiveTxnsSuccess,
  removeReceiveTxnsFailure,
  addReceiveTxnsRequest,
  addReceiveTxnsSuccess,
  addReceiveTxnsFailure,
  fetchSendDataRequest,
  fetchSendDataSuccess,
  fetchSendDataFailure,
  fetchWalletBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
  fetchPendingBalanceRequest,
  fetchPendingBalanceSuccess,
  fetchPendingBalanceFailure,
  stopWalletTxnPagination,
  setBlockChainInfo,
  createWalletRequest,
  createWalletSuccess,
  createWalletFailure,
  resetCreateWalletError,
  restoreWalletRequest,
  restoreWalletSuccess,
  restoreWalletFailure,
  resetRestoreWalletError,
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  setIsWalletCreatedRequest,
  setIsWalletCreatedStartRequest,
  fetchWalletTokenTransactionsListRequestLoading,
  fetchWalletTokenTransactionsListRequestSuccess,
  fetchWalletTokenTransactionsListRequestFailure,
  checkRestartCriteriaRequestLoading,
  checkRestartCriteriaRequestSuccess,
  checkRestartCriteriaRequestFailure,
} = actions;

export default reducer;
