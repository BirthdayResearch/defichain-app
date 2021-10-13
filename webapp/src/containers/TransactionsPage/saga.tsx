import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  stopWalletTxnPagination,
  fetchWalletTokenTransactionsListRequestLoading,
  fetchWalletTokenTransactionsListRequestSuccess,
  fetchWalletTokenTransactionsListRequestFailure,
  fetchBlockDataForTrxRequestLoading,
  fetchBlockDataForTrxRequestSuccess,
  fetchBlockDataForTrxRequestFailure,
  accountHistoryCountRequest,
  accountHistoryCountSuccess,
  accountHistoryCountFailure,
} from './reducer';
import {
  handleFetchTokens,
  handelFetchWalletTxns,
  handleFetchPendingBalance,
  handleBlockData,
  handleFetchAccounts,
  getListAccountHistory,
  handleFetchAccountHistoryCount,
} from './service';
import store from '../../app/rootStore';
import showNotification from '../../utils/notifications';
import { convertEpochToDate, getErrorMessage } from '../../utils/utility';
import { paginate, queuePush } from '../../utils/utility';
import { I18n } from 'react-redux-i18n';
import uniqBy from 'lodash/uniqBy';
import { AMOUNT_SEPARATOR, MAX_WALLET_TXN_PAGE_SIZE } from '../../constants';
import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';

export function* getNetwork() {
  const {
    blockChainInfo: { chain },
  } = yield select((state) => state.transaction);
  return chain;
}

export function* fetchWalletTxns(action) {
  const { currentPage: pageNo, pageSize, intialLoad } = action.payload;
  const { totalFetchedTxns, walletTxnCount, walletPageCounter } = yield select(
    (state) => state.transaction
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
    const { maxBlockData } = yield select((state) => state.transaction);
    const currentData = maxBlockData[symbol];

    if (pageNum === 1 || !currentData) {
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
      const amounts = Array.isArray(d.amounts) ? d.amounts : [d.amounts];
      return {
        owner: d.owner,
        blockHeight: d.blockHeight,
        blockHash: d.blockHash,
        blockTime: convertEpochToDate(d.blockTime),
        type: d.type,
        txn: d.txn,
        txid: d.txid,
        amountData: amounts.map((amount) => {
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
  } catch (err: any) {
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
  } catch (err: any) {
    log.error(err, 'fetchBlockDataForTrx');
    yield put(fetchBlockDataForTrxRequestFailure(err.message));
  }
}

function* mySaga() {
  yield takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns);
  yield takeLatest(accountHistoryCountRequest.type, accountHistoryCount);
  yield takeLatest(
    fetchWalletTokenTransactionsListRequestLoading.type,
    fetchWalletTokenTransactionsList
  );
  yield takeLatest(
    fetchBlockDataForTrxRequestLoading.type,
    fetchBlockDataForTrx
  );
}

export default mySaga;
