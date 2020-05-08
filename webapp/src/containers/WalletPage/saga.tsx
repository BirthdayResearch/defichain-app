import { call, put, takeLatest } from 'redux-saga/effects';
import * as HttpStatus from 'http-status-codes';
import log from 'loglevel';
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
  fetchWalletBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
} from './reducer';
import {
  handelFetchMasterNodes,
  handelFetchWalletTxns,
  handelReceivedData,
  handelSendData,
  handleFetchWalletBalance,
} from './service';

function* fetchWalletBalance() {
  try {
    const res = yield call(handleFetchWalletBalance);
    const { status, data } = res;
    if (status === HttpStatus.OK) {
      yield put(fetchWalletBalanceSuccess({ ...data }));
    } else {
      yield put(fetchWalletBalanceFailure(data.error || 'No data found'));
    }
  } catch (e) {
    yield put({ type: fetchWalletBalanceFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchMasterNodes() {
  try {
    const data = yield call(handelFetchMasterNodes);
    if (data && data.requests) {
      yield put(fetchPaymentRequestsSuccess({ ...data }));
    } else {
      yield put(fetchPaymentRequestsFailure('No data found'));
    }
  } catch (e) {
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchWalletTxns() {
  try {
    const data = yield call(handelFetchWalletTxns);
    if (data && data.walletTxns) {
      yield put(fetchWalletTxnsSuccess({ ...data }));
    } else {
      yield put(fetchWalletTxnsFailure('No data found'));
    }
  } catch (e) {
    yield put({ type: fetchWalletTxnsFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchReceivedData() {
  try {
    const data = yield call(handelReceivedData);
    if (data) {
      yield put(fetchReceivedDataSuccess({ ...data }));
    } else {
      yield put({
        type: fetchReceivedDataFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchReceivedDataFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchSendData() {
  try {
    const data = yield call(handelSendData);
    if (data) {
      yield put(fetchSendDataSuccess({ ...data }));
    } else {
      yield put(fetchSendDataFailure('No data found'));
    }
  } catch (e) {
    yield put({ type: fetchSendDataFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchPaymentRequestsRequest.type, fetchMasterNodes);
  yield takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns);
  yield takeLatest(fetchReceivedDataRequest.type, fetchReceivedData);
  yield takeLatest(fetchSendDataRequest.type, fetchSendData);
  yield takeLatest(fetchWalletBalanceRequest.type, fetchWalletBalance);
}

export default mySaga;
