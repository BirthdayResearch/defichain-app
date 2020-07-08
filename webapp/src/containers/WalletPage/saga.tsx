import { call, put, takeLatest } from 'redux-saga/effects';
import * as  log from '../../utils/electronLogger';
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
import showNotification from '../../utils/notifications';
import { I18n } from 'react-redux-i18n';

export function* fetchWalletBalance() {
  try {
    const result = yield call(handleFetchWalletBalance);
    yield put(fetchWalletBalanceSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.walletBalanceFailure'), e.message);
    yield put({ type: fetchWalletBalanceFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchPendingBalance() {
  try {
    const result = yield call(handleFetchPendingBalance);
    yield put(fetchPendingBalanceSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.pendingBalanceFailure'), e.message);
    yield put({ type: fetchPendingBalanceFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* addReceiveTxns(action: any) {
  try {
    const result = yield call(handelAddReceiveTxns, action.payload);
    yield put(addReceiveTxnsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.addReceiveTxnsFailure'), e.message);
    yield put(addReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

export function* removeReceiveTxns(action: any) {
  try {
    const result = yield call(handelRemoveReceiveTxns, action.payload);
    yield put(removeReceiveTxnsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.removeReceiveTxnsFailure'), e.message);
    yield put(removeReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

export function* fetchPayments() {
  try {
    const data = yield call(handelGetPaymentRequest);
    yield put(fetchPaymentRequestsSuccess(data));
  } catch (e) {
    showNotification(I18n.t('alerts.paymentRequestsFailure'), e.message);
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchWalletTxns(action) {
  try {
    const { currentPage: pageNo, pageSize } = action.payload;
    const data = yield call(handelFetchWalletTxns, pageNo, pageSize);
    if (data && data.walletTxns) {
      yield put(fetchWalletTxnsSuccess({ ...data }));
    } else {
      showNotification(I18n.t('alerts.walletTxnsFailure'), 'No data found');
      yield put(fetchWalletTxnsFailure('No data found'));
    }
  } catch (e) {
    showNotification(I18n.t('alerts.walletTxnsFailure'), e.message);
    yield put({ type: fetchWalletTxnsFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchSendData() {
  try {
    const data = yield call(handleSendData);
    if (data) {
      yield put(fetchSendDataSuccess({ data }));
    } else {
      showNotification(I18n.t('alerts.sendDataFailure'), 'No data found');
      yield put(fetchSendDataFailure('No data found'));
    }
  } catch (e) {
    showNotification(I18n.t('alerts.sendDataFailure'), e.message);
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
