import { takeLatest } from 'redux-saga/effects';
import * as testData from './testData.json';
import mySaga, {
  addReceiveTxns,
  removeReceiveTxns,
  fetchPayments,
  fetchWalletTxns,
  fetchSendData,
  fetchWalletBalance,
  fetchPendingBalance,
  fetchTokens,
  fetchAccountTokens,
  accountHistoryCount,
  createWallet,
  restoreWallet,
  fetchInstantBalance,
  fetchInstantPendingBalance,
  fetchWalletTokenTransactionsList,
  fetchBlockDataForTrx,
  checkRestartCriteria,
} from '../saga';
import {
  fetchTokensSuccess,
  fetchTokensRequest,
  fetchTokensFailure,
  fetchPaymentRequest,
  fetchWalletTxnsRequest,
  addReceiveTxnsRequest,
  addReceiveTxnsFailure,
  fetchSendDataRequest,
  fetchWalletBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
  removeReceiveTxnsRequest,
  fetchPendingBalanceRequest,
  fetchPendingBalanceSuccess,
  fetchPendingBalanceFailure,
  fetchAccountTokensRequest,
  fetchAccountTokensSuccess,
  fetchAccountTokensFailure,
  createWalletRequest,
  restoreWalletRequest,
  fetchInstantBalanceRequest,
  fetchInstantPendingBalanceRequest,
  fetchWalletTokenTransactionsListRequestLoading,
  checkRestartCriteriaRequestLoading,
  checkRestartCriteriaRequestSuccess,
  checkRestartCriteriaRequestFailure,
  fetchBlockDataForTrxRequestLoading,
  accountHistoryCountRequest,
} from '../reducer';
import * as service from '../service';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

const errorObj = {
  message: 'error occurred',
};

describe('Token page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every addReceiveTxnsRequest action and call addReceiveTxns', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(addReceiveTxnsRequest.type, addReceiveTxns)
    );
  });

  it('should wait for every removeReceiveTxnsRequest action and call removeReceiveTxns', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(removeReceiveTxnsRequest.type, removeReceiveTxns)
    );
  });

  it('should wait for every fetchPaymentRequest action and call fetchPayments', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPaymentRequest.type, fetchPayments)
    );
  });

  it('should wait for every fetchWalletTxnsRequest action and call fetchWalletTxns', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns)
    );
  });

  it('should wait for every fetchSendDataRequest action and call fetchSendData', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchSendDataRequest.type, fetchSendData)
    );
  });

  it('should wait for every fetchWalletBalanceRequest action and call fetchWalletBalance', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchWalletBalanceRequest.type, fetchWalletBalance)
    );
  });

  it('should wait for every fetchPendingBalanceRequest action and call fetchPendingBalance', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPendingBalanceRequest.type, fetchPendingBalance)
    );
  });

  it('should wait for every fetchTokensRequest action and call fetchTokens', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTokensRequest.type, fetchTokens)
    );
  });

  it('should wait for every fetchAccountTokensRequest action and call fetchAccountTokens', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchAccountTokensRequest.type, fetchAccountTokens)
    );
  });

  it('should wait for every accountHistoryCountRequest action and call accountHistoryCount', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(accountHistoryCountRequest.type, accountHistoryCount)
    );
  });

  it('should wait for every createWalletRequest action and call createWallet', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(createWalletRequest.type, createWallet)
    );
  });

  it('should wait for every restoreWalletRequest action and call restoreWallet', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(restoreWalletRequest.type, restoreWallet)
    );
  });

  it('should wait for every fetchInstantBalanceRequest action and call fetchInstantBalance', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchInstantBalanceRequest.type, fetchInstantBalance)
    );
  });

  it('should wait for every fetchInstantPendingBalanceRequest action and call fetchInstantPendingBalance', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(
        fetchInstantPendingBalanceRequest.type,
        fetchInstantPendingBalance
      )
    );
  });

  it('should wait for every fetchWalletTokenTransactionsListRequestLoading action and call fetchWalletTokenTransactionsList', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(
        fetchWalletTokenTransactionsListRequestLoading.type,
        fetchWalletTokenTransactionsList
      )
    );
  });

  it('should wait for every checkRestartCriteriaRequestLoading action and call checkRestartCriteria', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(checkRestartCriteriaRequestLoading.type, checkRestartCriteria)
    );
  });

  it('should wait for every fetchBlockDataForTrxRequestLoading action and call fetchBlockDataForTrx', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchBlockDataForTrxRequestLoading.type, fetchBlockDataForTrx)
    );
  });

  describe('addReceiveTxns', () => {
    let handelAddReceiveTxns;
    beforeEach(() => {
      handelAddReceiveTxns = jest.spyOn(service, 'handelAddReceiveTxns');
    });
    afterEach(() => {
      handelAddReceiveTxns.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handelAddReceiveTxns.mockImplementation(() =>
        Promise.resolve(testData.saga.networkName)
      );
      await dispatchedFunc(addReceiveTxns);
      expect(handelAddReceiveTxns).toBeCalledTimes(0);
    });

    it('should call api and dispatch failure action', async () => {
      handelAddReceiveTxns.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(addReceiveTxns);
      expect(handelAddReceiveTxns).toBeCalledTimes(0);
      expect(dispatched).toEqual([
        addReceiveTxnsFailure('env.getState is not a function'),
      ]);
    });
  });

  describe('fetchTokens', () => {
    let handleFetchTokens;
    beforeEach(() => {
      handleFetchTokens = jest.spyOn(service, 'handleFetchTokens');
    });
    afterEach(() => {
      handleFetchTokens.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchTokens.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchTokens)
      );
      await dispatchedFunc(fetchTokens);
      expect(handleFetchTokens).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchTokens.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchTokens);
      expect(handleFetchTokens).toBeCalledTimes(1);
      const data = testData.saga.handleFetchTokens;
      expect(dispatched).toEqual([fetchTokensSuccess({ tokens: data })]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchTokens.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchTokens);
      expect(handleFetchTokens).toBeCalledTimes(1);
      const error = 'env.getState is not a function';
      expect(dispatched).toEqual([fetchTokensFailure(errorObj.message)]);
    });
  });

  describe('fetchAccountTokens', () => {
    let handleFetchAccounts;
    beforeEach(() => {
      handleFetchAccounts = jest.spyOn(service, 'handleFetchAccounts');
    });
    afterEach(() => {
      handleFetchAccounts.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchAccounts.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchAccounts)
      );
      await dispatchedFunc(fetchAccountTokens);
      expect(handleFetchAccounts).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchAccounts.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchAccountTokens);
      expect(handleFetchAccounts).toBeCalledTimes(1);
      const data = testData.saga.handleFetchAccounts;
      expect(dispatched).toEqual([
        fetchAccountTokensSuccess({ accountTokens: data }),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchAccounts.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchAccountTokens);
      expect(handleFetchAccounts).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchAccountTokensFailure(errorObj.message)]);
    });
  });

  describe('fetchInstantBalance', () => {
    let handleFetchWalletBalance;
    beforeEach(() => {
      handleFetchWalletBalance = jest.spyOn(
        service,
        'handleFetchWalletBalance'
      );
    });
    afterEach(() => {
      handleFetchWalletBalance.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchWalletBalance.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchWalletBalance)
      );
      await dispatchedFunc(fetchInstantBalance);
      expect(handleFetchWalletBalance).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchWalletBalance.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchInstantBalance);
      expect(handleFetchWalletBalance).toBeCalledTimes(1);
      const data = testData.saga.handleFetchWalletBalance;
      expect(dispatched).toEqual([fetchWalletBalanceSuccess(data)]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchWalletBalance.mockImplementation(() =>
        Promise.reject(errorObj)
      );
      const dispatched = await dispatchedFunc(fetchInstantBalance);
      expect(handleFetchWalletBalance).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchWalletBalanceFailure(errorObj.message)]);
    });
  });

  describe('fetchAccountTokens', () => {
    let handleFetchAccounts;
    beforeEach(() => {
      handleFetchAccounts = jest.spyOn(service, 'handleFetchAccounts');
    });
    afterEach(() => {
      handleFetchAccounts.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchAccounts.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchAccounts)
      );
      await dispatchedFunc(fetchAccountTokens);
      expect(handleFetchAccounts).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchAccounts.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchAccountTokens);
      expect(handleFetchAccounts).toBeCalledTimes(1);
      const data = testData.saga.handleFetchAccounts;
      expect(dispatched).toEqual([
        fetchAccountTokensSuccess({ accountTokens: data }),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchAccounts.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchAccountTokens);
      expect(handleFetchAccounts).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchAccountTokensFailure(errorObj.message)]);
    });
  });

  describe('fetchInstantPendingBalance', () => {
    let handleFetchPendingBalance;
    beforeEach(() => {
      handleFetchPendingBalance = jest.spyOn(
        service,
        'handleFetchPendingBalance'
      );
    });
    afterEach(() => {
      handleFetchPendingBalance.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchPendingBalance.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchPendingBalance)
      );
      await dispatchedFunc(fetchInstantPendingBalance);
      expect(handleFetchPendingBalance).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchPendingBalance.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchInstantPendingBalance);
      expect(handleFetchPendingBalance).toBeCalledTimes(1);
      const data = testData.saga.handleFetchPendingBalance;
      expect(dispatched).toEqual([fetchPendingBalanceSuccess(data)]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchPendingBalance.mockImplementation(() =>
        Promise.reject(errorObj)
      );
      const dispatched = await dispatchedFunc(fetchInstantPendingBalance);
      expect(handleFetchPendingBalance).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchPendingBalanceFailure(errorObj.message),
      ]);
    });
  });

  describe('checkRestartCriteria', () => {
    let handleRestartCriteria;
    beforeEach(() => {
      handleRestartCriteria = jest.spyOn(service, 'handleRestartCriteria');
    });
    afterEach(() => {
      handleRestartCriteria.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleRestartCriteria.mockImplementation(() => Promise.resolve([]));
      await dispatchedFunc(checkRestartCriteria);
      expect(handleRestartCriteria).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleRestartCriteria.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(checkRestartCriteria);
      expect(handleRestartCriteria).toBeCalledTimes(1);
      const data = [];
      expect(dispatched).toEqual([checkRestartCriteriaRequestSuccess(data)]);
    });

    it('should call api and dispatch failure action', async () => {
      handleRestartCriteria.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(checkRestartCriteria);
      expect(handleRestartCriteria).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        checkRestartCriteriaRequestFailure(errorObj.message),
      ]);
    });
  });
});
