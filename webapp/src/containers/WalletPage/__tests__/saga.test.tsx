import { takeLatest } from 'redux-saga/effects';

import mySaga, {
  addReceiveTxns,
  removeReceiveTxns,
  fetchPayments,
  fetchWalletTxns,
  fetchSendData,
  fetchWalletBalance,
  fetchPendingBalance,
} from '../saga';
import {
  addReceiveTxnsRequest,
  removeReceiveTxnsRequest,
  fetchPaymentRequest,
  fetchWalletTxnsRequest,
  fetchSendDataRequest,
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
  fetchPendingBalanceSuccess,
  fetchPendingBalanceFailure,
  addReceiveTxnsSuccess,
  addReceiveTxnsFailure,
  removeReceiveTxnsFailure,
  removeReceiveTxnsSuccess,
  fetchPaymentRequestsSuccess,
  fetchPaymentRequestsFailure,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  fetchSendDataSuccess,
  fetchSendDataFailure,
} from '../reducer';
import * as service from '../service';
import { payload } from './testData.json';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

describe('Wallet page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every addReceiveTxnsRequest action and call addReceiveTxns method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(addReceiveTxnsRequest.type, addReceiveTxns)
    );
  });

  it('should wait for every removeReceiveTxnsRequest action and call removeReceiveTxns method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(removeReceiveTxnsRequest.type, removeReceiveTxns)
    );
  });

  it('should wait for every fetchPaymentRequest action and call fetchPayments method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPaymentRequest.type, fetchPayments)
    );
  });

  it('should wait for every fetchWalletTxnsRequest action and call fetchWalletTxns method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchWalletTxnsRequest.type, fetchWalletTxns)
    );
  });

  it('should wait for every fetchSendDataRequest action and call fetchSendData method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchSendDataRequest.type, fetchSendData)
    );
  });

  it('should wait for every fetchWalletBalanceRequest action and call fetchWalletBalance method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchWalletBalanceRequest.type, fetchWalletBalance)
    );
  });

  it('should wait for every fetchPendingBalanceRequest action and call fetchPendingBalance method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPendingBalanceRequest.type, fetchPendingBalance)
    );
  });

  it('should be done on next iteration', () => {
    expect(genObject.next().done).toBeTruthy();
  });
});

describe('fetchWalletBalance method', () => {
  let handleFetchWalletBalance;

  beforeEach(() => {
    handleFetchWalletBalance = jest.spyOn(service, 'handleFetchWalletBalance');
  });

  afterEach(() => {
    handleFetchWalletBalance.mockRestore();
  });

  afterAll(() => {
    handleFetchWalletBalance.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handleFetchWalletBalance.mockImplementation(() =>
      Promise.resolve(payload.walletBalance)
    );

    const dispatched = await dispatchedFunc(fetchWalletBalance);

    expect(handleFetchWalletBalance).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchWalletBalanceSuccess(payload.walletBalance),
    ]);
  });

  it('should call api and dispatch failure action', async () => {
    handleFetchWalletBalance.mockImplementation(() =>
      Promise.reject({ message: 'error while fetching balance' })
    );

    const dispatched = await dispatchedFunc(fetchWalletBalance);

    expect(handleFetchWalletBalance).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchWalletBalanceFailure('error while fetching balance'),
    ]);
  });
});

describe('fetchPendingBalance method', () => {
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

  afterAll(() => {
    handleFetchPendingBalance.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handleFetchPendingBalance.mockImplementation(() =>
      Promise.resolve(payload.pendingBalance)
    );

    const dispatched = await dispatchedFunc(fetchPendingBalance);

    expect(handleFetchPendingBalance).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchPendingBalanceSuccess(payload.pendingBalance),
    ]);
  });

  it('should call api and dispatch failure action', async () => {
    handleFetchPendingBalance.mockImplementation(() =>
      Promise.reject({ message: 'error while fetching pending balance' })
    );

    const dispatched = await dispatchedFunc(fetchPendingBalance);

    expect(handleFetchPendingBalance).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchPendingBalanceFailure('error while fetching pending balance'),
    ]);
  });
});

describe('addReceiveTxns method', () => {
  const data = Array();
  let handelAddReceiveTxns;

  beforeEach(() => {
    handelAddReceiveTxns = jest.spyOn(service, 'handelAddReceiveTxns');
  });

  afterEach(() => {
    handelAddReceiveTxns.mockRestore();
  });

  afterAll(() => {
    handelAddReceiveTxns.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handelAddReceiveTxns.mockImplementation(() => data);

    const dispatched = await dispatchedFunc(addReceiveTxns, data);

    expect(handelAddReceiveTxns).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([addReceiveTxnsSuccess(data)]);
  });

  it('should call api and dispatch failure action', async () => {
    handelAddReceiveTxns.mockImplementation(() => {
      throw new Error('Error in handleAddReceiveTxns');
    });

    const dispatched = await dispatchedFunc(addReceiveTxns, data);

    expect(handelAddReceiveTxns).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      addReceiveTxnsFailure('Error in handleAddReceiveTxns'),
    ]);
  });
});

describe('removeReceiveTxns method', () => {
  const id = 'dummy id';
  const data = Array();
  let handelRemoveReceiveTxns;

  beforeEach(() => {
    handelRemoveReceiveTxns = jest.spyOn(service, 'handelRemoveReceiveTxns');
  });

  afterEach(() => {
    handelRemoveReceiveTxns.mockRestore();
  });

  afterAll(() => {
    handelRemoveReceiveTxns.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handelRemoveReceiveTxns.mockImplementation(() => data);

    const dispatched = await dispatchedFunc(removeReceiveTxns, id);

    expect(handelRemoveReceiveTxns).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([removeReceiveTxnsSuccess(data)]);
  });

  it('should call api and dispatch failure action', async () => {
    handelRemoveReceiveTxns.mockImplementation(() => {
      throw new Error('Error in handleRemoveReceiveTxns');
    });

    const dispatched = await dispatchedFunc(removeReceiveTxns, id);

    expect(handelRemoveReceiveTxns).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      removeReceiveTxnsFailure('Error in handleRemoveReceiveTxns'),
    ]);
  });
});

describe('fetchPayments method', () => {
  const data = Array();
  let handelGetPaymentRequest;

  beforeEach(() => {
    handelGetPaymentRequest = jest.spyOn(service, 'handelGetPaymentRequest');
  });

  afterEach(() => {
    handelGetPaymentRequest.mockRestore();
  });

  afterAll(() => {
    handelGetPaymentRequest.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handelGetPaymentRequest.mockImplementation(() => data);

    const dispatched = await dispatchedFunc(fetchPayments);

    expect(handelGetPaymentRequest).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([fetchPaymentRequestsSuccess(data)]);
  });

  it('should call api and dispatch failure action', async () => {
    handelGetPaymentRequest.mockImplementation(() => {
      throw new Error('Error in handleGetPaymentRequest');
    });

    const dispatched = await dispatchedFunc(fetchPayments);

    expect(handelGetPaymentRequest).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchPaymentRequestsFailure('Error in handleGetPaymentRequest'),
    ]);
  });
});

describe('fetchWalletTxns method', () => {
  const { walletTxns, walletTxnCount } = payload;
  const pageNumber = 1;
  const pageSize = 5;
  const data = { walletTxns, walletTxnCount };
  let handelFetchWalletTxns;

  beforeEach(() => {
    handelFetchWalletTxns = jest.spyOn(service, 'handelFetchWalletTxns');
  });

  afterEach(() => {
    handelFetchWalletTxns.mockRestore();
  });

  afterAll(() => {
    handelFetchWalletTxns.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handelFetchWalletTxns.mockImplementation(() => Promise.resolve(data));

    const dispatched = await dispatchedFunc(fetchWalletTxns, {
      currentPage: pageNumber,
      pageSize,
    });

    expect(handelFetchWalletTxns).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([fetchWalletTxnsSuccess({ ...data })]);
  });

  it('should call api and dispatch failure action', async () => {
    handelFetchWalletTxns.mockImplementation(() => {
      throw new Error('Error in handleFetchWalletTxns');
    });

    const dispatched = await dispatchedFunc(fetchWalletTxns, {
      currentPage: pageNumber,
      pageSize,
    });

    expect(handelFetchWalletTxns).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchWalletTxnsFailure('Error in handleFetchWalletTxns'),
    ]);
  });
});

describe('fetchSendData method', () => {
  const data = payload.sendData;
  let handleSendData;

  beforeEach(() => {
    handleSendData = jest.spyOn(service, 'handleSendData');
  });

  afterEach(() => {
    handleSendData.mockRestore();
  });

  afterAll(() => {
    handleSendData.mockClear();
  });

  it('should call api and dispatch success action', async () => {
    handleSendData.mockImplementation(() => Promise.resolve(data));

    const dispatched = await dispatchedFunc(fetchSendData);

    expect(handleSendData).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([fetchSendDataSuccess({ data })]);
  });

  it('should call api and dispatch failure action', async () => {
    handleSendData.mockImplementation(() => {
      throw new Error('Error in handleSendData');
    });

    const dispatched = await dispatchedFunc(fetchSendData);

    expect(handleSendData).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchSendDataFailure('Error in handleSendData'),
    ]);
  });
});
