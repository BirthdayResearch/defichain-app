import {
  call,
  put,
  takeLatest,
  select,
  all,
  takeLeading,
} from 'redux-saga/effects';
import { I18n } from 'react-redux-i18n';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import * as log from '@/utils/electronLogger';
import store from '@/app/rootStore';
import showNotification from '@/utils/notifications';
import {
  getErrorMessage,
  getNetworkType,
  paginate,
  queuePush,
  getNetwork,
  handleLocalStorageNameLedger,
  convertEpochToDate,
} from '@/utils/utility';
import {
  AMOUNT_SEPARATOR,
  MAX_WALLET_TXN_PAGE_SIZE,
} from '@/constants';
import PersistentStore from '@/utils/persistentStore';
import * as reducer from './reducer';
import {
  setIsWalletCreatedRequest,
} from '@/containers/WalletPage/reducer';
import {
  handleFetchTokens,
  handelAddReceiveTxns,
  handelFetchWalletTxns,
  handleSendData,
  handleFetchWalletBalance,
  handelRemoveReceiveTxns,
  handleFetchPendingBalance,
  getAddressInfo,
  handleFetchAccounts,
  connectLedger,
  initialIsShowingInformation as initialIsShowingInformationService,
  setIsShowingInformation,
  getListDevicesLedger,
  importAddresses,
  handleBlockData,
  getListAccountHistory,
  handleFetchAccountHistoryCount, getAddressesLedger,
} from './service';

import { handelGetPaymentRequestLedger } from '@/utils/utility';
import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';

function* getPaymentRequestState() {
  const { paymentRequests = [] } = yield select((state) => {
    log.info(state);
    return state.ledgerWallet;
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
      const found = list.find((ele) => ele.address === item.address);
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
      const previousFetchedTxns = intialLoad ? [] : totalFetchedTxns;
      const totalFetched = previousFetchedTxns.concat(result.walletTxns);
      store.dispatch(
        reducer.fetchWalletTxnsSuccess({
          walletTxnCount: result.walletTxnCount,
          totalFetchedTxns: totalFetched,
          walletTxns: paginate(totalFetched, pageSize, pageNo),
          walletPageCounter: intialLoad ? 1 : walletPageCounter + 1,
        })
      );
      if (walletTxnCount <= pageNo * pageSize && !intialLoad) {
        store.dispatch(reducer.stopWalletTxnPagination());
      }
    } else {
      showNotification(I18n.t('alerts.walletTxnsFailure'), 'No data found');
      store.dispatch(reducer.fetchWalletTxnsFailure());
    }
  };
  if (walletTxnCount <= pageNo * pageSize || intialLoad) {
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
  const addresses = paymentRequests.map(
    (paymentRequest) => paymentRequest.address
  );
  queuePush(handleSendData, [addresses], callBack);
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
    const { devices, error } = yield call(getDevices);
    if (devices?.length && !error) {
      const result = yield call(connectLedger);
      if (result.success && result.data.isConnected) {
        const networkName = yield call(getNetwork);
        yield call(importAddresses, networkName);
        yield put(reducer.fetchConnectLedgerSuccess());
        yield put(reducer.fetchPaymentRequest());
        yield put(setIsWalletCreatedRequest(true));
      } else {
        yield put(
          reducer.fetchConnectLedgerFailure({ message: result.message })
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
      const devices = JSON.parse(devicesResult.data.devices);
      yield put(reducer.getDevicesSuccess(devices));
      return { devices };
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
    yield put(reducer.clearReceiveTxnsSuccess());
  } catch (error) {
    log.error(`Error clear clearReceiveTxns: ${error.message}`);
  }
}

export function* fetchWalletTokenTransactionsList(action) {
  try {
    const {
      symbol,
      limit,
      includeRewards,
      pageNum,
      minBlockHeight,
      cancelToken,
    } = action.payload;

    let blockHeight = minBlockHeight;
    const tempData = {};
    const { maxBlockData } = yield select((state) => state.ledgerWallet);
    const currentData = maxBlockData[symbol];

    if (pageNum === 1) {
      tempData[symbol] = [];
    } else if (
      currentData.length > 0 &&
      pageNum < currentData[currentData.length - 1].page
    ) {
      blockHeight = currentData[currentData.length - 2]?.maxBlockHeight;
      tempData[symbol] = currentData.filter(
        (val, index) => index < currentData.length - 1
      );
    } else {
      const currentBlockData = {
        page: pageNum,
        token: symbol,
        maxBlockHeight: minBlockHeight,
      };
      tempData[symbol] = [...currentData, currentBlockData];
    }

    const data: any[] = [];

    const networkType = getNetworkType();
    const addressesLedger = handelGetPaymentRequestLedger(networkType).map(
      (payment) => payment.address
    );
    for (const address of addressesLedger) {
      const res: any[] = yield call(getListAccountHistory, {
        limit: Number(limit),
        token: symbol,
        no_rewards: !includeRewards,
        cancelToken,
        owner: address,
      });
      data.push(...res);
    }

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
            unit: amount.split(AMOUNT_SEPARATOR)[1],
            amount: amount.split(AMOUNT_SEPARATOR)[0],
          };
        }),
      };
    });

    yield put(
      reducer.fetchWalletTokenTransactionsListRequestSuccess({
        data: orderBy(parsedData, 'blockHeight', 'desc'),
        minBlockHeight: minBlockHeightData,
        maxBlockData: tempData,
      })
    );
  } catch (err) {
    log.error(err, 'fetchWalletTokenTransactionsList of ledger');
    yield put(
      reducer.fetchWalletTokenTransactionsListRequestFailure(err.message)
    );
  }
}

export function* getBlockData(item) {
  const blockData = yield call(handleBlockData, item.blockHeight);
  return {
    ...item,
    blockData,
  };
}

export function* fetchBlockDataForTrx(action) {
  try {
    const trxArray: any[] = action.payload;
    const updated = yield all(trxArray.map((item) => call(getBlockData, item)));
    yield put(reducer.fetchBlockDataForTrxRequestSuccess(updated));
  } catch (err) {
    log.error(err, 'fetchBlockDataForTrx');
    yield put(reducer.fetchBlockDataForTrxRequestFailure(err.message));
  }
}

export function* accountHistoryCount(action) {
  const {
    payload: { no_rewards, token },
  } = action;

  try {
    const addresses = getAddressesLedger()
    let data = 0;
    for (const address of addresses) {
      const res = yield call(handleFetchAccountHistoryCount, no_rewards, token, address);
      data += res;
    }
    yield put({
      type: reducer.accountHistoryCountSuccess.type,
      payload: { accountHistoryCount: data },
    });
  } catch (e) {
    yield put({
      type: reducer.accountHistoryCountFailure.type,
      payload: getErrorMessage(e),
    });
    log.error(e);
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
  yield takeLatest(reducer.clearReceiveTxns.type, clearReceiveTxns);
  yield takeLatest(
    reducer.fetchWalletTokenTransactionsListRequestLoading.type,
    fetchWalletTokenTransactionsList
  );
  yield takeLatest(
    reducer.fetchBlockDataForTrxRequestLoading.type,
    fetchBlockDataForTrx
  );
  yield takeLatest(
    reducer.accountHistoryCountRequest.type,
    accountHistoryCount
  );
}

export default mySaga;
