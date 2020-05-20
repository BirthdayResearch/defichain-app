import { call, put, takeLatest } from 'redux-saga/effects';
import log from 'loglevel';
import {
  fetchPaymentRequest,
  fetchPaymentRequestsSuccess,
  fetchPaymentRequestsFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  addReceiveTxnsRequest,
  addReceiveTxnsSuccess,
  addReceiveTxnsFailure,
  fetchSendDataFailure,
  fetchSendDataRequest,
  fetchSendDataSuccess,
  fetchWalletBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
  removeReceiveTxnsRequest,
  removeReceiveTxnsSuccess,
  removeReceiveTxnsFailure,
  fetchPendingBalanceRequest,
  fetchPendingBalanceSuccess,
  fetchPendingBalanceFailure,
} from './reducer';
import {
  handelGetPaymentRequest,
  handelAddReceiveTxns,
  handelFetchWalletTxns,
  handleSendData,
  handleFetchWalletBalance,
  handelRemoveReceiveTxns,
  handleFetchPendingBalance,
} from './service';

function* fetchWalletBalance() {
  try {
    const result = yield call(handleFetchWalletBalance);
    yield put(fetchWalletBalanceSuccess(result));
  } catch (e) {
    yield put({ type: fetchWalletBalanceFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchPendingBalance() {
  try {
    const result = yield call(handleFetchPendingBalance);
    yield put(fetchPendingBalanceSuccess(result));
  } catch (e) {
    yield put({ type: fetchPendingBalanceFailure.type, payload: e.message });
    log.error(e);
  }
}

function* addReceiveTxns(action: any) {
  try {
    const result = yield call(handelAddReceiveTxns, action.payload);
    yield put(addReceiveTxnsSuccess(result));
  } catch (e) {
    yield put(addReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

function* removeReceiveTxns(action: any) {
  try {
    const result = yield call(handelRemoveReceiveTxns, action.payload);
    yield put(removeReceiveTxnsSuccess(result));
  } catch (e) {
    yield put(removeReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

function* fetchPayments() {
  try {
    const data = yield call(handelGetPaymentRequest);
    yield put(fetchPaymentRequestsSuccess(data));
  } catch (e) {
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchWalletTxns(action) {
  try {
    const { currentPage: pageNo, pageSize } = action.payload;
    const data = yield call(handelFetchWalletTxns, pageNo, pageSize);
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

function* fetchSendData() {
  try {
    const data = yield call(handleSendData);
    if (data) {
      yield put(fetchSendDataSuccess({ data }));
    } else {
      yield put(fetchSendDataFailure('No data found'));
    }
  } catch (e) {
    yield put({ type: fetchSendDataFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(addReceiveTxnsRequest.type, addReceiveTxns);
  yield takeLatest(removeReceiveTxnsRequest.type, removeReceiveTxns);
  yield takeLatest(fetchPaymentRequest.type, fetchPayments);
  yield takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns);
  yield takeLatest(fetchSendDataRequest.type, fetchSendData);
  yield takeLatest(fetchWalletBalanceRequest.type, fetchWalletBalance);
  yield takeLatest(fetchPendingBalanceRequest.type, fetchPendingBalance);
}

export default mySaga;
