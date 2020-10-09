import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  fetchTokensSuccess,
  fetchTokensRequest,
  fetchTokensFailure,
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
  fetchAccountTokensRequest,
  fetchAccountTokensSuccess,
  fetchAccountTokensFailure,
  stopWalletTxnPagination,
  setBlockChainInfo,
} from './reducer';
import {
  handleFetchTokens,
  handelGetPaymentRequest,
  handelAddReceiveTxns,
  handelFetchWalletTxns,
  handleSendData,
  handleFetchWalletBalance,
  handelRemoveReceiveTxns,
  handleFetchPendingBalance,
  handleAccountFetchTokens,
  getAddressInfo,
  getBlockChainInfo,
  handleFetchAccounts,
} from './service';
import store from '../../app/rootStore';
import showNotification from '../../utils/notifications';
import { paginate, getErrorMessage } from '../../utils/utility';
import { queuePush } from '../../utils/utility';
import { I18n } from 'react-redux-i18n';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { MAX_WALLET_TXN_PAGE_SIZE } from '../../constants';

export function* getNetwork() {
  const {
    blockChainInfo: { chain },
  } = yield select((state) => state.wallet);
  return chain;
}

function fetchWalletBalance() {
  const callBack = (err, result) => {
    if (err) {
      showNotification(I18n.t('alerts.walletBalanceFailure'), err.message);
      store.dispatch(fetchWalletBalanceFailure(err.message));
      log.error(err);
      return;
    }
    store.dispatch(fetchWalletBalanceSuccess(result));
  };
  queuePush(handleFetchWalletBalance, [], callBack);
}

function fetchPendingBalance() {
  const callBack = (err, result) => {
    if (err) {
      showNotification(I18n.t('alerts.pendingBalanceFailure'), err.message);
      store.dispatch(fetchPendingBalanceFailure(err.message));
      log.error(err);
      return;
    }
    store.dispatch(fetchPendingBalanceSuccess(result));
  };
  queuePush(handleFetchPendingBalance, [], callBack);
}

function* getPaymentRequestState() {
  const { paymentRequests = [] } = yield select((state) => state.wallet);
  return cloneDeep(paymentRequests);
}

export function* addReceiveTxns(action: any) {
  try {
    const cloneDeepPaymentRequests = yield call(getPaymentRequestState);

    const networkName = yield call(getNetwork);

    yield call(handelAddReceiveTxns, action.payload, networkName);

    cloneDeepPaymentRequests.push(action.payload);

    yield put(addReceiveTxnsSuccess(cloneDeepPaymentRequests));
  } catch (e) {
    showNotification(I18n.t('alerts.addReceiveTxnsFailure'), e.message);
    yield put(addReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

export function* removeReceiveTxns(action: any) {
  try {
    const cloneDeepPaymentRequests = yield call(getPaymentRequestState);

    const networkName = yield call(getNetwork);

    yield call(handelRemoveReceiveTxns, action.payload, networkName);

    const result = cloneDeepPaymentRequests.filter(
      (ele) => ele.id && ele.id.toString() !== action.payload.toString()
    );

    yield put(removeReceiveTxnsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.removeReceiveTxnsFailure'), e.message);
    yield put(removeReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

export function* fetchPayments() {
  try {
    const networkName = yield call(getNetwork);
    const data = yield call(handelGetPaymentRequest, networkName);
    const list = yield all(
      data.map((item) => call(getAddressInfo, item.address))
    );
    const result = data.filter((item) => {
      const found = list.find(
        (ele) => ele.address === item.address && ele.ismine && !ele.iswatchonly
      );
      return !isEmpty(found);
    });
    yield put(fetchPaymentRequestsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.paymentRequestsFailure'), e.message);
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    log.error(e);
  }
}

function* fetchWalletTxns(action) {
  const { currentPage: pageNo, pageSize, intialLoad } = action.payload;
  const { totalFetchedTxns, walletTxnCount, walletPageCounter } = yield select(
    (state) => state.wallet
  );
  const callBack = (err, result) => {
    if (err) {
      store.dispatch(fetchWalletTxnsFailure(err.message));
      log.error(err);
      return;
    }
    if (result && result.walletTxns) {
      const distinct = uniqBy(result.walletTxns, 'txnId');
      const previousFetchedTxns = intialLoad ? [] : totalFetchedTxns;
      const totalFetched = previousFetchedTxns.concat(distinct);
      store.dispatch(
        fetchWalletTxnsSuccess({
          walletTxnCount: result.walletTxnCount,
          totalFetchedTxns: totalFetched,
          walletTxns: paginate(totalFetched, pageSize, pageNo),
          walletPageCounter: intialLoad ? 1 : walletPageCounter + 1,
        })
      );
    } else {
      showNotification(I18n.t('alerts.walletTxnsFailure'), 'No data found');
      store.dispatch(fetchWalletTxnsFailure('No data found'));
    }
  };
  if (totalFetchedTxns.length <= (pageNo - 1) * pageSize || intialLoad) {
    yield put(stopWalletTxnPagination());
    queuePush(
      handelFetchWalletTxns,
      [walletPageCounter, MAX_WALLET_TXN_PAGE_SIZE],
      callBack
    );
  } else {
    yield put(
      fetchWalletTxnsSuccess({
        totalFetchedTxns,
        walletTxnCount,
        walletTxns: paginate(totalFetchedTxns, pageSize, pageNo),
        walletPageCounter,
      })
    );
  }
}

function fetchSendData() {
  const callBack = (err, result) => {
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
  };
  queuePush(handleSendData, [], callBack);
}

export function* fetchChainInfo() {
  let result;
  try {
    const data = yield call(getBlockChainInfo);
    result = data;
  } catch (err) {
    log.error(err.message);
    result = {};
  }
  yield put(setBlockChainInfo(result));
}

export function* fetchTokens() {
  try {
    const data = yield call(handleFetchTokens);
    yield put({
      type: fetchTokensSuccess.type,
      payload: { tokens: data },
    });
  } catch (e) {
    yield put({ type: fetchTokensFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchAccountTokens() {
  try {
    const data = yield call(handleFetchAccounts);
    yield put({
      type: fetchAccountTokensSuccess.type,
      payload: { accountTokens: data },
    });
  } catch (e) {
    yield put({
      type: fetchAccountTokensFailure.type,
      payload: getErrorMessage(e),
    });
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
  yield takeLatest(fetchTokensRequest.type, fetchTokens);
  yield takeLatest(fetchAccountTokensRequest.type, fetchAccountTokens);
}

export default mySaga;
