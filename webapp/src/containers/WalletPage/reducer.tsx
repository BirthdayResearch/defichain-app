import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'wallet',
  initialState: {
    walletBalance: 0,
    isBalanceFetching: false,
    isBalanceError: '',
    paymentRequests: [],
    walletTxns: [],
    receivedData: {
      amountToReceive: '',
      amountToReceiveDisplayed: 0,
      receiveMessage: '',
      showBackdrop: '',
      receiveStep: 'default',
    },
    sendData: {
      walletBalance: 100,
      amountToSend: '',
      amountToSendDisplayed: 0,
      toAddress: '',
      scannerOpen: false,
      flashed: '',
      showBackdrop: '',
      sendStep: 'default',
      waitToSend: 5,
    },
  },
  reducers: {
    fetchPaymentRequestsRequest(state) {
      state.paymentRequests = [];
    },
    fetchPaymentRequestsSuccess(state, action) {
      state.paymentRequests = action.payload.requests;
    },
    fetchPaymentRequestsFailure(state, action) {
      state.paymentRequests = [];
    },
    fetchWalletTxnsRequest(state) {
      state.walletTxns = [];
    },
    fetchWalletTxnsSuccess(state, action) {
      state.walletTxns = action.payload.walletTxns;
    },
    fetchWalletTxnsFailure(state, action) {
      state.walletTxns = [];
    },
    fetchReceivedDataRequest(state) {},
    fetchReceivedDataSuccess(state, action) {
      state.receivedData = action.payload.data;
    },
    fetchReceivedDataFailure(state, action) {},
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
      state.walletBalance = action.payload.result;
      state.isBalanceFetching = false;
    },
    fetchWalletBalanceFailure(state, action) {
      state.walletBalance = 0;
      state.isBalanceFetching = false;
      state.isBalanceError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchPaymentRequestsRequest,
  fetchPaymentRequestsSuccess,
  fetchPaymentRequestsFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  fetchReceivedDataRequest,
  fetchReceivedDataSuccess,
  fetchReceivedDataFailure,
  fetchSendDataRequest,
  fetchSendDataSuccess,
  fetchSendDataFailure,
  fetchWalletBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
} = actions;

export default reducer;
