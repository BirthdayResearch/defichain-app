import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchPaymentRequestsRequest,
  fetchPaymentRequestsSuccess,
  fetchPaymentRequestsFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  fetchReceivedDataRequest,
  fetchReceivedDataFailure,
  fetchReceivedDataSuccess,
  fetchSendDataFailure,
  fetchSendDataRequest,
  fetchSendDataSuccess,
} from "./reducer";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function* fetchMasterNodes() {
  try {
    const data = yield call(handelFetchMasterNodes);
    if (data && data.requests) {
      yield put({
        type: fetchPaymentRequestsSuccess.type,
        payload: { ...data },
      });
    } else {
      yield put({
        type: fetchPaymentRequestsFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    console.log(e);
  }
}

function handelFetchMasterNodes() {
  const data = {
    requests: [
      {
        id: 0,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 1,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 2,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 3,
        type: "Sent",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 4,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 5,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 6,
        type: "Sent",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 7,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
    ],
  };
  return data;
}

function* fetchWalletTxns() {
  try {
    const data = yield call(handelFetchWalletTxns);
    if (data && data.walletTxns) {
      yield put({
        type: fetchWalletTxnsSuccess.type,
        payload: { ...data },
      });
    } else {
      yield put({
        type: fetchWalletTxnsFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: fetchWalletTxnsFailure.type, payload: e.message });
    console.log(e);
  }
}

function handelFetchWalletTxns() {
  const data = {
    walletTxns: [
      {
        id: 0,
        time: "Feb 19, 2:03 pm",
        amount: 0.123,
        message: "I need money!",
        unit: "DFI",
      },
      {
        id: 1,
        time: "Feb 19, 2:03 pm",
        amount: 0.123,
        message: "I need money!",
        unit: "DFI",
      },
    ],
  };
  return data;
}

function* fetchReceivedData() {
  try {
    const data = yield call(handelReceivedData);
    if (data) {
      yield put({
        type: fetchReceivedDataSuccess.type,
        payload: { ...data },
      });
    } else {
      yield put({
        type: fetchReceivedDataFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: fetchReceivedDataFailure.type, payload: e.message });
    console.log(e);
  }
}

function handelReceivedData() {
  const data = {
    amountToReceive: "",
    amountToReceiveDisplayed: 0,
    receiveMessage: "",
    showBackdrop: "",
    receiveStep: "default",
  };
  return data;
}

function* fetchSendData() {
  try {
    const data = yield call(handelSendData);
    if (data) {
      yield put({
        type: fetchSendDataSuccess.type,
        payload: { ...data },
      });
    } else {
      yield put({
        type: fetchSendDataFailure.type,
        payload: "No data found",
      });
    }
  } catch (e) {
    yield put({ type: fetchSendDataFailure.type, payload: e.message });
    console.log(e);
  }
}

function handelSendData() {
  const data = {
    walletBalance: 100,
    amountToSend: "",
    amountToSendDisplayed: 0,
    toAddress: "",
    scannerOpen: false,
    flashed: "",
    showBackdrop: "",
    sendStep: "default",
    waitToSend: 5,
  };
  return data;
}

function* mySaga() {
  yield takeLatest(fetchPaymentRequestsRequest.type, fetchMasterNodes);
  yield takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns);
  yield takeLatest(fetchReceivedDataRequest.type, fetchReceivedData);
  yield takeLatest(fetchSendDataRequest.type, fetchSendData);
}

export default mySaga;
