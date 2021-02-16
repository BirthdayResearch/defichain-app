import {
  call,
  put,
  takeLatest,
  select,
  all,
  takeLeading,
} from 'redux-saga/effects';
import { I18n } from 'react-redux-i18n';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import * as log from '@/utils/electronLogger';
import store from '@/app/rootStore';
import showNotification from '@/utils/notifications';
import {
  getErrorMessage,
  getMnemonicFromObj,
  getNetworkInfo,
  getNetworkType,
  isValidMnemonic,
  paginate,
  queuePush,
  getNetwork,
  handleLocalStorageNameLedger,
} from '@/utils/utility';
import {
  MAIN,
  MAX_WALLET_TXN_PAGE_SIZE,
  WALLET_TOKENS_PATH,
} from '@/constants';
import PersistentStore from '@/utils/persistentStore';
import { createMnemonicIpcRenderer } from '@/app/update.ipcRenderer';
import * as reducer from './reducer';
import {
  handleFetchTokens,
  handelAddReceiveTxns,
  handelFetchWalletTxns,
  handleSendData,
  handleFetchWalletBalance,
  handelRemoveReceiveTxns,
  handleFetchPendingBalance,
  getAddressInfo,
  getBlockChainInfo,
  handleFetchAccounts,
  setHdSeed,
  importPrivKey,
  connectLedger,
  initialIsShowingInformation as initialIsShowingInformationService,
  setIsShowingInformation,
  getListDevicesLedger,
  getBackupIndexesLedger,
  importAddresses,
} from './service';

import { handelGetPaymentRequestLedger } from '@/utils/utility';

function* getPaymentRequestState() {
  const { paymentRequests = [] } = yield select((state) => {
    log.info(state);
    return state.ledgerWallet
  });
  return cloneDeep(paymentRequests);
}

export function* addReceiveTxns(action: any) {
  try {
    const cloneDeepPaymentRequests = yield call(getPaymentRequestState);

    const networkName = yield call(getNetwork);

    yield call(handelAddReceiveTxns, action.payload, networkName);

    cloneDeepPaymentRequests.push(action.payload);

    yield put(reducer.addReceiveTxnsSuccess(cloneDeepPaymentRequests));
  } catch (e) {
    showNotification(I18n.t('alerts.addReceiveTxnsFailure'), e.message);
    yield put(reducer.addReceiveTxnsFailure(e.message));
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

    yield put(reducer.removeReceiveTxnsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.removeReceiveTxnsFailure'), e.message);
    yield put(reducer.removeReceiveTxnsFailure(e.message));
    log.error(e);
  }
}

export function* fetchPayments() {
  try {
    const networkName = yield call(getNetwork);
    const data = yield call(handelGetPaymentRequestLedger, networkName);
    const list = yield all(
      data.map((item) => call(getAddressInfo, item.address))
    );
    const result = data.filter((item) => {
      const found = list.find(
        (ele) => ele.address === item.address
      );
      return !isEmpty(found);
    });
    yield put(reducer.fetchPaymentRequestsSuccess(result));
  } catch (e) {
    showNotification(I18n.t('alerts.paymentRequestsFailure'), e.message);
    yield put({
      type: reducer.fetchPaymentRequestsFailure.type,
      payload: e.message,
    });
    log.error(e);
  }
}

function* fetchWalletTxns(action) {
  const { currentPage: pageNo, pageSize, intialLoad } = action.payload;
  const { totalFetchedTxns, walletTxnCount, walletPageCounter } = yield select(
    (state) => state.ledgerWallet
  );
  const callBack = (err, result) => {
    if (err) {
      store.dispatch(reducer.fetchWalletTxnsFailure());
      log.error(err);
      return;
    }
    if (result && result.walletTxns) {
      const distinct = uniqBy(result.walletTxns, 'txnId');
      const previousFetchedTxns = intialLoad ? [] : totalFetchedTxns;
      const totalFetched = previousFetchedTxns.concat(distinct);
      store.dispatch(
        reducer.fetchWalletTxnsSuccess({
          walletTxnCount: result.walletTxnCount,
          totalFetchedTxns: totalFetched,
          walletTxns: paginate(totalFetched, pageSize, pageNo),
          walletPageCounter: intialLoad ? 1 : walletPageCounter + 1,
        })
      );
    } else {
      showNotification(I18n.t('alerts.walletTxnsFailure'), 'No data found');
      store.dispatch(reducer.fetchWalletTxnsFailure());
    }
  };
  if (totalFetchedTxns.length <= (pageNo - 1) * pageSize || intialLoad) {
    const networkName = yield call(getNetwork);
    yield put(reducer.stopWalletTxnPagination());
    queuePush(
      handelFetchWalletTxns,
      [walletPageCounter, MAX_WALLET_TXN_PAGE_SIZE, networkName],
      callBack
    );
  } else {
    yield put(
      reducer.fetchWalletTxnsSuccess({
        totalFetchedTxns,
        walletTxnCount,
        walletTxns: paginate(totalFetchedTxns, pageSize, pageNo),
        walletPageCounter,
      })
    );
  }
}

function* fetchSendData() {
  const callBack = (err, result) => {
    if (err) {
      showNotification(I18n.t('alerts.sendDataFailure'), err.message);
      store.dispatch(reducer.fetchSendDataFailure());
      log.error(err);
      return;
    }
    if (result) store.dispatch(reducer.fetchSendDataSuccess({ data: result }));
    else {
      showNotification(I18n.t('alerts.sendDataFailure'), 'No data found');
      store.dispatch(reducer.fetchSendDataFailure());
    }
  };
  const paymentRequests = yield call(getPaymentRequestState);
  const addresses = paymentRequests.map(paymentRequest => paymentRequest.address);
  queuePush(handleSendData, [addresses], callBack);
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
  yield put(reducer.setBlockChainInfo(result));
}

export function* fetchTokens() {
  try {
    const data = yield call(handleFetchTokens);
    yield put({
      type: reducer.fetchTokensSuccess.type,
      payload: { tokens: data },
    });
  } catch (e) {
    yield put({ type: reducer.fetchTokensFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchAccountTokens() {
  try {
    const data = yield call(handleFetchAccounts);
    yield put({
      type: reducer.fetchAccountTokensSuccess.type,
      payload: { accountTokens: data },
    });
  } catch (e) {
    yield put({
      type: reducer.fetchAccountTokensFailure.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
  }
}

export function* fetchInstantBalance() {
  try {
    log.info('fetchInstantBalance');
    const paymentRequests = yield call(getPaymentRequestState);
    const data = yield call(
      handleFetchWalletBalance,
      paymentRequests.map((paymentRequest) => paymentRequest.address)
    );
    log.info(`Ledger balance: ${JSON.stringify(data)}`);
    yield put(reducer.fetchWalletBalanceSuccess(data));
  } catch (err) {
    yield put(reducer.fetchWalletBalanceFailure(err.message));
    log.error(err);
  }
}

export function* fetchInstantPendingBalance() {
  try {
    const result = yield call(handleFetchPendingBalance);
    yield put(reducer.fetchPendingBalanceSuccess(result));
  } catch (err) {
    yield put(reducer.fetchPendingBalanceFailure(err.message));
    log.error(err);
  }
}

export function* fetchConnectLedger() {
  try {
    const {
      data: { devices },
      error,
    } = yield call(getDevices);
    if (devices.length && !error) {
      const result = yield call(connectLedger);
      if (result.success && result.data.isConnected) {
        const networkName = yield call(getNetwork);
        yield call(importAddresses, networkName);
        yield put(reducer.fetchConnectLedgerSuccess());
        yield put(reducer.fetchPaymentRequest());
      } else {
        yield put(
          reducer.fetchConnectLedgerFailure({ message: result.data.message })
        );
      }
    } else {
      yield put(reducer.fetchConnectLedgerFailure(error));
    }
  } catch (err) {
    log.error(`Fetch connect ${err.message}`);
    yield put(reducer.fetchConnectLedgerFailure(err.message));
  }
}

export function* initialIsShowingInformation() {
  try {
    const isShowingInformation = yield call(initialIsShowingInformationService);
    log.info(`isShowingInformation: ${isShowingInformation}`);
    yield put(reducer.setIsShowingInformationSuccess(isShowingInformation));
  } catch (e) {
    yield put(reducer.setIsShowingInformationFailure());
    log.error(e);
  }
}

export function* updateIsShowingInformation(action) {
  try {
    yield call(setIsShowingInformation, action.payload);
    yield put(reducer.setIsShowingInformationSuccess(action.payload));
  } catch (e) {
    yield put(reducer.setIsShowingInformationFailure());
    log.error(e);
  }
}

export function* getDevices() {
  try {
    yield put(reducer.getDevicesRequest());
    const devicesResult = yield call(getListDevicesLedger);
    if (devicesResult.success) {
      yield put(reducer.getDevicesSuccess(devicesResult.data.devices));
      return devicesResult;
    } else {
      throw new Error(devicesResult.message);
    }
  } catch (error) {
    yield put(reducer.getDevicesFailure(error));
    return { error };
  }
}

export function* clearReceiveTxns() {
  try {
    const networkName = yield call(getNetwork);
    const localStorageName = handleLocalStorageNameLedger(networkName);
    PersistentStore.set(localStorageName, []);
    yield put(reducer.clearReceiveTxnsSuccess())
  } catch (error) {
    log.error(`Error clear clearReceiveTxns: ${error.message}`);
  }
}

function* mySaga() {
  yield takeLatest(reducer.addReceiveTxnsRequest.type, addReceiveTxns);
  yield takeLatest(reducer.removeReceiveTxnsRequest.type, removeReceiveTxns);
  yield takeLatest(reducer.fetchPaymentRequest.type, fetchPayments);
  yield takeLatest(reducer.fetchWalletTxnsRequest.type, fetchWalletTxns);
  yield takeLatest(reducer.fetchSendDataRequest.type, fetchSendData);
  yield takeLatest(reducer.fetchTokensRequest.type, fetchTokens);
  yield takeLatest(reducer.fetchAccountTokensRequest.type, fetchAccountTokens);
  yield takeLatest(
    reducer.fetchInstantBalanceRequest.type,
    fetchInstantBalance
  );
  yield takeLatest(
    reducer.fetchInstantPendingBalanceRequest.type,
    fetchInstantPendingBalance
  );
  yield takeLeading(reducer.fetchConnectLedgerRequest.type, fetchConnectLedger);
  yield takeLatest(
    reducer.initialIsShowingInformationRequest.type,
    initialIsShowingInformation
  );
  yield takeLatest(
    reducer.updateIsShowingInformationRequest.type,
    updateIsShowingInformation
  );
  yield takeLatest(
    reducer.clearReceiveTxns.type,
    clearReceiveTxns
  );
}

export default mySaga;
