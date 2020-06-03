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
import queue from '../../worker/queue';
import store from '../../app/rootStore';
import showNotification from '../../utils/notifications';
import { I18n } from 'react-redux-i18n';

function fetchWalletBalance() {
  queue.push(
    { methodName: handleFetchWalletBalance, params: [] },
    (err, result) => {
      if (err) {
        showNotification(I18n.t('alerts.walletBalanceFailure'), err.message);
        store.dispatch(fetchWalletBalanceFailure(err.message));
        log.error(err);
        return;
      }
      store.dispatch(fetchWalletBalanceSuccess(result));
    }
  );
}

function fetchPendingBalance() {
  queue.push(
    { methodName: handleFetchPendingBalance, params: [] },
    (err, result) => {
      if (err) {
        showNotification(I18n.t('alerts.pendingBalanceFailure'), err.message);
        store.dispatch(fetchPendingBalanceFailure(err.message));
        log.error(err);
        return;
      }
      store.dispatch(fetchPendingBalanceSuccess(result));
    }
  );
}

function* addReceiveTxns(action: any) {
  try {
    const result = yield call(handelAddReceiveTxns, action.payload);
    yield put(addReceiveTxnsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.addReceiveTxnsFailure'), e.message);
    yield put(addReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

function* removeReceiveTxns(action: any) {
  try {
    const result = yield call(handelRemoveReceiveTxns, action.payload);
    yield put(removeReceiveTxnsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.removeReceiveTxnsFailure'), e.message);
    yield put(removeReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

function* fetchPayments() {
  try {
    const data = yield call(handelGetPaymentRequest);
    yield put(fetchPaymentRequestsSuccess(data));
  } catch (e) {
    showNotification(I18n.t('alerts.paymentRequestsFailure'), e.message);
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    log.error(e);
  }
}

function fetchWalletTxns(action) {
  const { currentPage: pageNo, pageSize } = action.payload;
  queue.push(
    { methodName: handelFetchWalletTxns, params: [pageNo, pageSize] },
    (err, result) => {
      if (err) {
        store.dispatch(fetchWalletTxnsFailure(err.message));
        log.error(err);
        return;
      }
      if (result && result.walletTxns)
        store.dispatch(fetchWalletTxnsSuccess({ ...result }));
      else {
        showNotification(I18n.t('alerts.walletTxnsFailure'), 'No data found');
        store.dispatch(fetchWalletTxnsFailure('No data found'));
      }
    }
  );
}

function fetchSendData() {
  queue.push({ methodName: handleSendData, params: [] }, (err, result) => {
    if (err) {
      showNotification(I18n.t('alerts.sendDataFailure'), err.message);
      store.dispatch(fetchSendDataFailure(err.message));
      log.error(err);
      return;
    }
    if (result) store.dispatch(fetchSendDataSuccess({ data: result }));
    else {
      showNotification(I18n.t('alerts.sendDataFailure'), 'No data found');
      store.dispatch(fetchSendDataFailure('No data found'));
    }
  });
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
