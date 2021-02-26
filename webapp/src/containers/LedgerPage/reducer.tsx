import { createSlice } from '@reduxjs/toolkit';
import { LedgerState } from './types';
import * as log from '@/utils/electronLogger';

export const initialState: LedgerState = {
  connect: {
    status: 'notConnected',
    error: null,
    device: null,
  },
  isShowingInformation: false,
  devices: {
    list: [],
    error: null,
  },
  accountTokens: {
    data: [],
    isLoaded: false,
    isLoading: false,
  },
  tokens: [],
  isTokensLoaded: false,
  isLoadingTokens: false,
  walletBalance: 0,
  isBalanceFetching: false,
  isBalanceError: '',
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
  isErrorRestoringWallet: '',
  indexesKeyLedger: {
    data: null,
    isLoading: false,
    error: null,
  },
};
const configSlice = createSlice({
  name: 'ledgerWallet',
  initialState,
  reducers: {
    fetchAccountTokensRequest(state) {
      state.accountTokens.isLoading = true;
    },
    fetchAccountTokensSuccess(state, action) {
      state.accountTokens = {
        data: action.payload.accountTokens,
        isLoading: false,
        isLoaded: true,
      };
    },
    fetchAccountTokensFailure(state) {
      state.accountTokens = {
        data: [],
        isLoading: false,
        isLoaded: true,
      };
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
    fetchPaymentRequestsFailure(state) {
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
    fetchWalletTxnsFailure(state) {
      state.walletTxns = [];
      state.isWalletTxnsLoading = false;
    },
    removeReceiveTxnsRequest(state, action) {
      /* */
    },
    removeReceiveTxnsSuccess(state, action) {
      state.paymentRequests = action.payload;
    },
    removeReceiveTxnsFailure(state, action) {
      /* */
    },
    addReceiveTxnsRequest(state, action) {
      /* */
    },
    addReceiveTxnsSuccess(state, action) {
      state.paymentRequests = action.payload;
    },
    addReceiveTxnsFailure(state, action) {
      /* */
    },
    fetchSendDataRequest() {
      /* */
    },
    fetchSendDataSuccess(state, action) {
      state.sendData = action.payload.data;
    },
    fetchSendDataFailure() {
      /* */
    },
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
    resetCreateWalletError(state) {
      state.isWalletCreating = false;
      state.isErrorCreatingWallet = '';
    },
    resetRestoreWalletError(state) {
      state.isWalletRestoring = false;
      state.isErrorRestoringWallet = '';
    },
    fetchInstantBalanceRequest() {
      /* */
    },
    fetchInstantPendingBalanceRequest() {
      /* */
    },
    fetchConnectLedgerRequest(state) {
      state.connect.status = 'connecting';
      state.connect.error = null;
    },
    fetchConnectLedgerSuccess(state) {
      state.connect.status = 'connected';
    },
    fetchConnectLedgerFailure(state, action) {
      state.connect.status = 'notConnected';
      state.connect.error = action.payload;
    },
    initialIsShowingInformationRequest(state) {
      /* */
    },
    setIsShowingInformationSuccess(state, action) {
      state.isShowingInformation = action.payload;
    },
    setIsShowingInformationFailure(state) {
      state.isShowingInformation = false;
    },
    updateIsShowingInformationRequest(state, action) {
      /* */
    },
    getDevicesRequest(state) {
      state.devices = {
        list: [],
        error: null,
      };
    },
    getDevicesSuccess(state, action) {
      state.devices.list = action.payload;
    },
    getDevicesFailure(state, action) {
      state.devices.error = action.payload;
      state.devices.list = [{
        deviceModel: {
          productName: 'Ledger',
        },
      }];
    },
    getDevicesClear(state) {
      state.devices = {
        list: [],
        error: null,
      };
    },

    clearReceiveTxns(state) {
      /* */
    },

    clearReceiveTxnsSuccess(state) {
      state.paymentRequests = [];
    }
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
  resetCreateWalletError,
  resetRestoreWalletError,
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  fetchConnectLedgerRequest,
  fetchConnectLedgerSuccess,
  fetchConnectLedgerFailure,
  initialIsShowingInformationRequest,
  setIsShowingInformationSuccess,
  setIsShowingInformationFailure,
  updateIsShowingInformationRequest,
  getDevicesRequest,
  getDevicesSuccess,
  getDevicesFailure,
  getDevicesClear,
  clearReceiveTxns,
  clearReceiveTxnsSuccess,
} = actions;

export default reducer;
