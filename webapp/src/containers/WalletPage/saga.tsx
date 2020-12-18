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
  createWalletFailure,
  createWalletSuccess,
  createWalletRequest,
  restoreWalletFailure,
  restoreWalletRequest,
  restoreWalletSuccess,
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  setIsWalletCreatedRequest,
  fetchWalletTokenTransactionsListRequestLoading,
  fetchWalletTokenTransactionsListRequestSuccess,
  fetchWalletTokenTransactionsListRequestFailure,
  checkRestartCriteriaRequestLoading,
  checkRestartCriteriaRequestSuccess,
  checkRestartCriteriaRequestFailure,
  fetchBlockDataForTrxRequestLoading,
  fetchBlockDataForTrxRequestSuccess,
  fetchBlockDataForTrxRequestFailure,
  accountHistoryCountRequest,
  accountHistoryCountSuccess,
  accountHistoryCountFailure,
} from './reducer';
import {
  handleFetchTokens,
  handleGetPaymentRequest,
  handelAddReceiveTxns,
  handelFetchWalletTxns,
  handleSendData,
  handleFetchWalletBalance,
  handelRemoveReceiveTxns,
  handleFetchPendingBalance,
  handleBlockData,
  getAddressInfo,
  getBlockChainInfo,
  handleFetchAccounts,
  setHdSeed,
  importPrivKey,
  getListAccountHistory,
  handleRestartCriteria,
  handleFetchAccountHistoryCount,
} from './service';
import store from '../../app/rootStore';
import showNotification from '../../utils/notifications';
import {
  convertEpochToDate,
  getErrorMessage,
  getMnemonicFromObj,
  getNetworkInfo,
  getNetworkType,
  isValidMnemonic,
  isWalletCreated,
} from '../../utils/utility';
import { paginate, queuePush } from '../../utils/utility';
import { I18n } from 'react-redux-i18n';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import {
  IS_WALLET_CREATED_MAIN,
  IS_WALLET_CREATED_TEST,
  MAIN,
  MAX_WALLET_TXN_PAGE_SIZE,
  WALLET_TOKENS_PATH,
} from '../../constants';
import PersistentStore from '../../utils/persistentStore';
import { createMnemonicIpcRenderer } from '../../app/update.ipcRenderer';
import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import uid from 'uid';

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
    const data = yield call(handleGetPaymentRequest, networkName);
    const list = yield all(
      data.map((item) => {
        item.id = item.id ?? uid();
        return call(getAddressInfo, item.address);
      })
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
  const isWalletCreatedVal = isWalletCreated(result.chain);
  yield put(setIsWalletCreatedRequest(isWalletCreatedVal));
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

export function* accountHistoryCount(action) {
  const {
    payload: { no_rewards, token },
  } = action;

  try {
    const data = yield call(handleFetchAccountHistoryCount, no_rewards, token);
    yield put({
      type: accountHistoryCountSuccess.type,
      payload: { accountHistoryCount: data },
    });
  } catch (e) {
    yield put({
      type: accountHistoryCountFailure.type,
      payload: getErrorMessage(e),
    });
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

export function* createWallet(action) {
  try {
    const {
      payload: { mnemonicCode, history },
    } = action;

    const networkType = getNetworkType();
    const network = getNetworkInfo(networkType);
    const isWalletCreated =
      networkType === MAIN ? IS_WALLET_CREATED_MAIN : IS_WALLET_CREATED_TEST;

    const hdSeed = yield call(createMnemonicIpcRenderer, mnemonicCode, network);

    yield call(setHdSeed, hdSeed);
    yield put({ type: createWalletSuccess.type });
    PersistentStore.set(isWalletCreated, true);
    yield put(setIsWalletCreatedRequest(true));
    history.push(WALLET_TOKENS_PATH);
  } catch (e) {
    log.error(e.message);
    yield put({ type: createWalletFailure.type, payload: getErrorMessage(e) });
  }
}

export function* restoreWallet(action) {
  try {
    const {
      payload: { mnemonicObj, history },
    } = action;

    const mnemonicCode = getMnemonicFromObj(mnemonicObj);
    const isValid = isValidMnemonic(mnemonicCode);
    if (!isValid) {
      throw new Error(`Not a valid mnemonic`);
    }

    const networkType = getNetworkType();
    const network = getNetworkInfo(networkType);
    const isWalletCreated =
      networkType === MAIN ? IS_WALLET_CREATED_MAIN : IS_WALLET_CREATED_TEST;

    const hdSeed = yield call(createMnemonicIpcRenderer, mnemonicCode, network);

    yield call(setHdSeed, hdSeed);
    yield call(importPrivKey, hdSeed);
    yield put({ type: restoreWalletSuccess.type });
    PersistentStore.set(isWalletCreated, true);
    yield put(setIsWalletCreatedRequest(true));
    history.push(WALLET_TOKENS_PATH);
  } catch (e) {
    log.error(e.message);
    yield put({ type: restoreWalletFailure.type, payload: getErrorMessage(e) });
  }
}

export function* fetchInstantBalance() {
  try {
    const result = yield call(handleFetchWalletBalance);
    yield put(fetchWalletBalanceSuccess(result));
  } catch (err) {
    yield put(fetchWalletBalanceFailure(err.message));
    log.error(err);
  }
}

export function* fetchInstantPendingBalance() {
  try {
    const result = yield call(handleFetchPendingBalance);
    yield put(fetchPendingBalanceSuccess(result));
  } catch (err) {
    yield put(fetchPendingBalanceFailure(err.message));
    log.error(err);
  }
}

function* fetchWalletTokenTransactionsList(action) {
  try {
    const { symbol, limit, includeRewards, minBlockHeight } = action.payload;

    const data: any[] = yield call(getListAccountHistory, {
      limit,
      token: symbol,
      no_rewards: !includeRewards,
      blockHeight: minBlockHeight,
    });

    const minHeightData = data.length ? minBy(data, 'blockHeight') : -1;
    const minBlockHeightData = minHeightData.blockHeight - 1;

    const parsedData = data.map((d) => {
      return {
        owner: d.owner,
        blockHeight: d.blockHeight,
        blockHash: d.blockHash,
        blockTime: convertEpochToDate(d.blockTime),
        type: d.type,
        txn: d.txn,
        txid: d.txid,
        amountData: d.amounts.map((amount) => {
          return {
            unit: amount.split('@')[1],
            amount: amount.split('@')[0],
          };
        }),
      };
    });

    yield put(
      fetchWalletTokenTransactionsListRequestSuccess({
        data: orderBy(parsedData, 'blockHeight', 'desc'),
        minBlockHeight: minBlockHeightData,
      })
    );
  } catch (err) {
    yield put(fetchWalletTokenTransactionsListRequestFailure(err.message));
  }
}

function* getBlockData(item) {
  const blockData = yield call(handleBlockData, item.blockHeight);
  return {
    ...item,
    blockData,
  };
}

function* fetchBlockDataForTrx(action) {
  try {
    const trxArray: any[] = action.payload;
    const updated = yield all(trxArray.map((item) => call(getBlockData, item)));
    yield put(fetchBlockDataForTrxRequestSuccess(updated));
  } catch (err) {
    yield put(fetchBlockDataForTrxRequestFailure(err.message));
  }
}

function* checkRestartCriteria() {
  try {
    const restartCriteria = yield call(handleRestartCriteria);
    yield put(checkRestartCriteriaRequestSuccess(restartCriteria));
  } catch (err) {
    yield put(checkRestartCriteriaRequestFailure(err.message));
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
  yield takeLatest(accountHistoryCountRequest.type, accountHistoryCount);
  yield takeLatest(createWalletRequest.type, createWallet);
  yield takeLatest(restoreWalletRequest.type, restoreWallet);
  yield takeLatest(fetchInstantBalanceRequest.type, fetchInstantBalance);
  yield takeLatest(
    fetchInstantPendingBalanceRequest.type,
    fetchInstantPendingBalance
  );
  yield takeLatest(
    fetchWalletTokenTransactionsListRequestLoading.type,
    fetchWalletTokenTransactionsList
  );
  yield takeLatest(
    checkRestartCriteriaRequestLoading.type,
    checkRestartCriteria
  );
  yield takeLatest(
    fetchBlockDataForTrxRequestLoading.type,
    fetchBlockDataForTrx
  );
}

export default mySaga;
