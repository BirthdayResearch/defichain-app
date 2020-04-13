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
import {
  handelFetchMasterNodes,
  handelFetchWalletTxns,
  handelReceivedData,
  handelSendData,
} from "./Wallet.service";

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

function* mySaga() {
  yield takeLatest(fetchPaymentRequestsRequest.type, fetchMasterNodes);
  yield takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns);
  yield takeLatest(fetchReceivedDataRequest.type, fetchReceivedData);
  yield takeLatest(fetchSendDataRequest.type, fetchSendData);
}

export default mySaga;
