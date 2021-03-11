import { call, put, takeLatest, select, all, delay } from 'redux-saga/effects';
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
  fetchWalletReset,
  fetchWalletMapRequest,
  fetchWalletMapSuccess,
  fetchWalletMapFailure,
  startRestoreWalletViaBackup,
  restoreWalletViaBackupFailure,
  startRestoreWalletViaRecent,
  startBackupWalletViaExitModal,
  setWalletEncryptedRequest,
  setWalletEncrypted,
  startBackupWalletViaPostEncryptModal,
  createWalletStart,
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
  startRestoreViaBackup,
  startRestoreViaRecent,
  startBackupViaExitModal,
  createNewWallet,
} from './service';
import store from '../../app/rootStore';
import showNotification from '../../utils/notifications';
import {
  convertEpochToDate,
  getErrorMessage,
  getMnemonicFromObj,
  getNetworkInfo,
  getNetworkType,
  hdWalletCheck,
  isValidMnemonic,
} from '../../utils/utility';
import { paginate, queuePush } from '../../utils/utility';
import { I18n } from 'react-redux-i18n';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import {
  AMOUNT_SEPARATOR,
  MAX_WALLET_TXN_PAGE_SIZE,
  WALLET_TOKENS_PATH,
} from '../../constants';
import {
  createMnemonicIpcRenderer,
  enableMenuResetWalletBtn,
} from '../../app/update.ipcRenderer';
import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import { uid } from 'uid';
import { restartNodeSync } from '../../utils/isElectron';
import { shutDownBinary } from '../../worker/queue';
import { history } from '../../utils/history';
import { checkWalletEncryption, getWalletMap } from '../../app/service';
import {
  encryptWalletSuccess,
  openEncryptWalletModal,
  openExitWalletModal,
  openRestoreWalletModal,
  startResetWalletDatRequest,
} from '../PopOver/reducer';
import { openPostEncryptBackupModal } from '../PopOver/reducer';
import { setDefaultLockTimeout } from '../SettingsPage/reducer';
import { WalletMap } from '@defi_types/walletMap';
import { TimeoutLockEnum } from '../SettingsPage/types';

export function* getNetwork() {
  const {
    blockChainInfo: { chain },
  } = yield select((state) => state.wallet);
  return chain;
}

export function fetchWalletBalance() {
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

export function fetchPendingBalance() {
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

export async function addHdSeedCheck(list) {
  const result = list.map(async (data) => {
    return {
      ...data,
      hdSeed: await hdWalletCheck(data.address),
    };
  });
  const resolvedData = await Promise.all(result);
  return resolvedData;
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
    const finalResult = yield call(addHdSeedCheck, result);
    yield put(fetchPaymentRequestsSuccess(finalResult));
  } catch (e) {
    showNotification(I18n.t('alerts.paymentRequestsFailure'), e.message);
    yield put({ type: fetchPaymentRequestsFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchWalletTxns(action) {
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
      const noDataFound = 'No data found';
      showNotification(I18n.t('alerts.walletTxnsFailure'), noDataFound);
      store.dispatch(fetchWalletTxnsFailure(noDataFound));
      log.error(`${noDataFound}`, 'fetchWalletTxns');
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

export function fetchSendData() {
  const callBack = (err, result) => {
    if (err) {
      showNotification(I18n.t('alerts.sendDataFailure'), err.message);
      store.dispatch(fetchSendDataFailure(err.message));
      log.error(err);
      return;
    }
    if (result) store.dispatch(fetchSendDataSuccess({ data: result }));
    else {
      const noDataFound = 'No data found';
      showNotification(I18n.t('alerts.sendDataFailure'), noDataFound);
      store.dispatch(fetchSendDataFailure(noDataFound));
      log.error(`${noDataFound}`, 'fetchSendData');
    }
  };
  queuePush(handleSendData, [], callBack);
}

//* If wallet is existing on conf, set wallet loaded
export function* setWalletExistingIfInConf(conf: any) {
  const network = getNetworkType();
  const isWalletCreatedConf =
    conf != null &&
    conf[network] != null &&
    conf[network]?.wallet != null &&
    conf[network]?.walletdir != null;
  store.dispatch(setIsWalletCreatedRequest(isWalletCreatedConf));
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
  const { app } = store.getState();
  yield call(setWalletExistingIfInConf, app.rpcConfig);
  const { wallet } = store.getState();
  yield put(setWalletEncryptedRequest(wallet.isWalletCreatedFlag));
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
      payload: { mnemonicCode },
    } = action;
    const networkType = getNetworkType();
    const network = getNetworkInfo(networkType);
    const hdSeed = yield call(
      createMnemonicIpcRenderer,
      mnemonicCode,
      network,
      networkType
    );
    yield call(setHdSeed, hdSeed);
    yield put({ type: createWalletSuccess.type });
    yield put(setIsWalletCreatedRequest(true));
    yield call(enableMenuResetWalletBtn, true);
    history.push(WALLET_TOKENS_PATH);
  } catch (e) {
    log.error(e.message);
    yield put({ type: createWalletFailure.type, payload: getErrorMessage(e) });
  }
}

export function* restoreWallet(action) {
  try {
    const {
      payload: { mnemonicObj },
    } = action;

    const mnemonicCode = getMnemonicFromObj(mnemonicObj);
    const isValid = isValidMnemonic(mnemonicCode);
    if (!isValid) {
      throw new Error(`Not a valid mnemonic`);
    }

    const networkType = getNetworkType();
    const network = getNetworkInfo(networkType);

    const hdSeed = yield call(
      createMnemonicIpcRenderer,
      mnemonicCode,
      network,
      networkType
    );

    yield call(setHdSeed, hdSeed);
    yield call(importPrivKey, hdSeed);
    yield call(restoreWalletStep);
    yield call(() => {
      history.push(WALLET_TOKENS_PATH);
    });
  } catch (e) {
    log.error(e.message);
    yield put({ type: restoreWalletFailure.type, payload: getErrorMessage(e) });
  }
}

export function* restoreWalletStep() {
  yield call(enableMenuResetWalletBtn, true);
  yield call(shutDownBinary);
  yield call(fetchWalletReset);
  yield call(restartNodeSync);
  yield call(fetchAccountTokensRequest);
  yield call(fetchInstantBalanceRequest);
  yield call(fetchInstantPendingBalanceRequest);
  yield call(fetchPaymentRequest);
  yield put({ type: restoreWalletSuccess.type });
  yield put(setIsWalletCreatedRequest(true));
}

export function* restoreWalletViaBackup() {
  try {
    log.info(`Starting restore via backup...`, 'restoreWalletViaBackup');
    const networkType = getNetworkType();
    const resp = yield call(startRestoreViaBackup, networkType);
    if (resp?.success) {
      yield call(restoreWalletStep);
      log.info(`Restore via backup successful`, 'restoreWalletViaBackup');
    } else {
      yield put({
        type: restoreWalletViaBackupFailure.type,
        payload: resp?.message,
      });
    }
  } catch (e) {
    log.error(e.message, 'restoreWalletViaBackup');
    yield put({
      type: restoreWalletViaBackupFailure.type,
      payload: getErrorMessage(e),
    });
  }
}

export function* restoreWalletViaRecent(action: any) {
  try {
    log.info(`Starting restore via recent...`, 'restoreWalletViaRecent');
    const networkType = getNetworkType();
    yield put(openRestoreWalletModal({ isOpen: false, filePath: null }));
    yield delay(2000);
    const resp = yield call(startRestoreViaRecent, action.payload, networkType);
    if (resp?.success) {
      yield call(restoreWalletStep);
      log.info(`Restore via recent successful`, 'restoreWalletViaRecent');
    } else {
      yield put({
        type: restoreWalletViaBackupFailure.type,
        payload: resp?.message,
      });
    }
  } catch (e) {
    log.error(e.message, 'restoreWalletViaRecent');
    yield put({
      type: restoreWalletViaBackupFailure.type,
      payload: getErrorMessage(e),
    });
  }
}

export function* handleCreateWalletStart(action: any) {
  try {
    log.info(`Starting create wallet...`, 'handleCreateWalletStart');
    const { passphrase } = action.payload;
    const networkType = getNetworkType();
    const resp = yield call(createNewWallet, passphrase, networkType);
    if (resp?.success) {
      yield call(shutDownBinary);
      yield call(restartNodeSync);
      yield put(setIsWalletCreatedRequest(true));
      yield call(enableMenuResetWalletBtn, true);
      yield put(encryptWalletSuccess());
      yield put(setWalletEncrypted(true));
      yield put(createWalletSuccess());
      history.push(WALLET_TOKENS_PATH);
      log.info(`Create wallet successful`, 'handleCreateWalletStart');
    } else {
      yield put({
        type: createWalletFailure.type,
        payload: resp?.message,
      });
    }
  } catch (e) {
    yield put(createWalletFailure(e.message));
    log.error(e.message, 'handleCreateWalletStart');
  }
}

export function* backupWalletViaExitModal() {
  try {
    log.info(`Starting backup via exit modal...`, 'backupWalletViaExitModal');
    const resp = yield call(startBackupViaExitModal);
    if (resp?.success) {
      yield put(openExitWalletModal(false));
      yield put(startResetWalletDatRequest());
      log.info(`Exit wallet successful`, 'backupWalletViaExitModal');
    } else {
      yield put(openExitWalletModal(false));
    }
  } catch (e) {
    yield put(openExitWalletModal(false));
    log.error(e.message, 'backupWalletViaExitModal');
  }
}

export function* backupWalletViaPostEncryptModal() {
  try {
    log.info(
      `Starting backup via post encrypt modal...`,
      'backupWalletViaPostEncryptModal'
    );
    const resp = yield call(startBackupViaExitModal);
    if (resp?.success) {
      yield put(openPostEncryptBackupModal(false));
    }
  } catch (e) {
    log.error(e.message, 'backupWalletViaPostEncryptModal');
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
    const { maxBlockData } = yield select((state) => state.wallet);
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

    const data: any[] = yield call(getListAccountHistory, {
      limit,
      token: symbol,
      no_rewards: !includeRewards,
      cancelToken: cancelToken,
      blockHeight,
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
            unit: amount.split(AMOUNT_SEPARATOR)[1],
            amount: amount.split(AMOUNT_SEPARATOR)[0],
          };
        }),
      };
    });

    yield put(
      fetchWalletTokenTransactionsListRequestSuccess({
        data: orderBy(parsedData, 'blockHeight', 'desc'),
        minBlockHeight: minBlockHeightData,
        maxBlockData: tempData,
      })
    );
  } catch (err) {
    log.error(err, 'fetchWalletTokenTransactionsList');
    yield put(fetchWalletTokenTransactionsListRequestFailure(err.message));
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
    yield put(fetchBlockDataForTrxRequestSuccess(updated));
  } catch (err) {
    log.error(err, 'fetchBlockDataForTrx');
    yield put(fetchBlockDataForTrxRequestFailure(err.message));
  }
}

export function* checkRestartCriteria() {
  try {
    const restartCriteria = yield call(handleRestartCriteria);
    yield put(checkRestartCriteriaRequestSuccess(restartCriteria));
  } catch (err) {
    log.error(err, 'checkRestartCriteria');
    yield put(checkRestartCriteriaRequestFailure(err.message));
  }
}

export function* fetchWalletMap() {
  try {
    const walletMap: WalletMap = yield call(getWalletMap);
    if (walletMap) {
      yield put(fetchWalletMapSuccess(walletMap));
      yield put(
        setDefaultLockTimeout(
          walletMap.lockTimeout || TimeoutLockEnum.FIVE_MINUTES
        )
      );
    }
  } catch (err) {
    log.error(err, 'fetchWalletMap');
    yield put(fetchWalletMapFailure(err?.message));
  }
}

export function* startWalletEncryptionCheck(action) {
  try {
    const isWalletCreatedFlag = action.payload;
    const isEncrypted = yield call(checkWalletEncryption);
    yield put(setWalletEncrypted(isEncrypted));
    if (!isEncrypted && isWalletCreatedFlag) {
      yield put(openEncryptWalletModal());
    }
  } catch (error) {
    log.error(error, 'startWalletEncryptionCheck');
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
  yield takeLatest(fetchWalletMapRequest.type, fetchWalletMap);
  yield takeLatest(startRestoreWalletViaBackup.type, restoreWalletViaBackup);
  yield takeLatest(startRestoreWalletViaRecent.type, restoreWalletViaRecent);
  yield takeLatest(
    startBackupWalletViaExitModal.type,
    backupWalletViaExitModal
  );
  yield takeLatest(setWalletEncryptedRequest.type, startWalletEncryptionCheck);
  yield takeLatest(
    startBackupWalletViaPostEncryptModal.type,
    backupWalletViaPostEncryptModal
  );
  yield takeLatest(createWalletStart.type, handleCreateWalletStart);
}

export default mySaga;
