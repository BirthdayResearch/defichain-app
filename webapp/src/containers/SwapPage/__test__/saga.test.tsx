import { takeLatest } from 'redux-saga/effects';
import * as testData from './testData.json';
import mySaga, {
  fetchPoolPairList,
  fetchTestPoolSwapTo,
  fetchTestPoolSwapFrom,
  fetchTokenBalanceList,
  poolSwap,
  fetchUtxoDfi,
  fetchMaxAccountDfi,
} from '../saga';
import {
  fetchTestPoolSwapRequestTo,
  fetchTestPoolSwapRequestFrom,
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchPoolPairListSuccess,
  fetchTestPoolSwapSuccessTo,
  fetchTestPoolSwapSuccessFrom,
  fetchTestPoolSwapFailureTo,
  fetchTestPoolSwapFailureFrom,
  poolSwapRequest,
  poolSwapSuccess,
  poolSwapFailure,
  fetchUtxoDfiRequest,
  fetchUtxoDfiFailure,
  fetchUtxoDfiSuccess,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} from '../reducer';
import { fetchMaxAccountDfiRequest } from '../../LiquidityPage/reducer';
import * as service from '../service';
import * as utility from '../../../utils/utility';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

const errorObj = {
  message: 'error occurred',
};

describe('Swap page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every fetchPoolPairListRequest action and call fetchPoolPairList', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList)
    );
  });

  it('should wait for every fetchTestPoolSwapRequestTo action and call fetchTestPoolSwapTo', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTestPoolSwapRequestTo.type, fetchTestPoolSwapTo)
    );
  });

  it('should wait for every fetchTestPoolSwapRequestFrom action and call fetchTestPoolSwapFrom', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTestPoolSwapRequestFrom.type, fetchTestPoolSwapFrom)
    );
  });

  it('should wait for every fetchTokenBalanceListRequest action and call fetchTokenBalanceList', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList)
    );
  });

  it('should wait for every poolSwapRequest action and call poolSwap', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(poolSwapRequest.type, poolSwap)
    );
  });

  it('should wait for every fetchUtxoDfiRequest action and call fetchUtxoDfi', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchUtxoDfiRequest.type, fetchUtxoDfi)
    );
  });

  it('should wait for every fetchMaxAccountDfiRequest action and call fetchMaxAccountDfi', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchMaxAccountDfiRequest.type, fetchMaxAccountDfi)
    );
  });

  describe('fetchPoolPairList', () => {
    let handleFetchPoolPairList;
    beforeEach(() => {
      handleFetchPoolPairList = jest.spyOn(service, 'handleFetchPoolPairList');
    });
    afterEach(() => {
      handleFetchPoolPairList.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchPoolPairList.mockImplementation(() =>
        Promise.resolve(testData.poolPairList)
      );
      await dispatchedFunc(fetchPoolPairList);
      expect(handleFetchPoolPairList).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchPoolPairList.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchPoolPairList);
      expect(handleFetchPoolPairList).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchPoolPairListSuccess([])]);
    });
  });

  describe('fetchTestPoolSwapTo', () => {
    let handleTestPoolSwapTo;
    beforeEach(() => {
      handleTestPoolSwapTo = jest.spyOn(service, 'handleTestPoolSwapTo');
    });
    afterEach(() => {
      handleTestPoolSwapTo.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleTestPoolSwapTo.mockImplementation(() =>
        Promise.resolve(testData.saga.handleTestPoolSwapTo)
      );
      await dispatchedFunc(fetchTestPoolSwapTo);
      expect(handleTestPoolSwapTo).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleTestPoolSwapTo.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchTestPoolSwapTo);
      expect(handleTestPoolSwapTo).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchTestPoolSwapSuccessTo([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handleTestPoolSwapTo.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchTestPoolSwapTo);
      expect(handleTestPoolSwapTo).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchTestPoolSwapFailureTo(errorObj.message),
      ]);
    });
  });

  describe('fetchTestPoolSwapFrom', () => {
    let handleTestPoolSwapFrom;
    beforeEach(() => {
      handleTestPoolSwapFrom = jest.spyOn(service, 'handleTestPoolSwapFrom');
    });
    afterEach(() => {
      handleTestPoolSwapFrom.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleTestPoolSwapFrom.mockImplementation(() =>
        Promise.resolve(testData.handleTestPoolSwapFrom)
      );
      await dispatchedFunc(fetchTestPoolSwapFrom);
      expect(handleTestPoolSwapFrom).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleTestPoolSwapFrom.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchTestPoolSwapFrom);
      expect(handleTestPoolSwapFrom).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchTestPoolSwapSuccessFrom([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handleTestPoolSwapFrom.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchTestPoolSwapFrom);
      expect(handleTestPoolSwapFrom).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchTestPoolSwapFailureFrom(errorObj.message),
      ]);
    });
  });

  describe('fetchTokenBalanceList', () => {
    let handleFetchTokenBalanceList;
    beforeEach(() => {
      handleFetchTokenBalanceList = jest.spyOn(
        utility,
        'handleFetchTokenBalanceList'
      );
    });
    afterEach(() => {
      handleFetchTokenBalanceList.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchTokenBalanceList.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchTokenBalanceList)
      );
      await dispatchedFunc(fetchTokenBalanceList);
      expect(handleFetchTokenBalanceList).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchTokenBalanceList.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchTokenBalanceList);
      expect(handleFetchTokenBalanceList).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchTokenBalanceListSuccess([])]);
    });
  });

  describe('poolSwap', () => {
    let handlePoolSwap;
    beforeEach(() => {
      handlePoolSwap = jest.spyOn(service, 'handlePoolSwap');
    });
    afterEach(() => {
      handlePoolSwap.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handlePoolSwap.mockImplementation(() =>
        Promise.resolve(testData.saga.handlePoolSwap)
      );
      await dispatchedFunc(poolSwap);
      expect(handlePoolSwap).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handlePoolSwap.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(poolSwap);
      expect(handlePoolSwap).toBeCalledTimes(1);
      expect(dispatched).toEqual([poolSwapSuccess([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handlePoolSwap.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(poolSwap);
      expect(handlePoolSwap).toBeCalledTimes(1);
      expect(dispatched).toEqual([poolSwapFailure(errorObj.message)]);
    });
  });

  describe('fetchUtxoDfi', () => {
    let handleFetchUtxoDFI;
    beforeEach(() => {
      handleFetchUtxoDFI = jest.spyOn(utility, 'handleFetchUtxoDFI');
    });
    afterEach(() => {
      handleFetchUtxoDFI.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchUtxoDFI.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchUtxoDFI)
      );
      await dispatchedFunc(fetchUtxoDfi);
      expect(handleFetchUtxoDFI).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchUtxoDFI.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchUtxoDfi);
      expect(handleFetchUtxoDFI).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchUtxoDfiSuccess([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchUtxoDFI.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchUtxoDfi);
      expect(handleFetchUtxoDFI).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchUtxoDfiFailure(errorObj.message)]);
    });
  });

  describe('fetchMaxAccountDfi', () => {
    let handleFetchTokenDFI;
    beforeEach(() => {
      handleFetchTokenDFI = jest.spyOn(utility, 'handleFetchTokenDFI');
    });
    afterEach(() => {
      handleFetchTokenDFI.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchTokenDFI.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchTokenDFI)
      );
      await dispatchedFunc(fetchMaxAccountDfi);
      expect(handleFetchTokenDFI).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchTokenDFI.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchMaxAccountDfi);
      expect(handleFetchTokenDFI).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchMaxAccountDfiSuccess([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchTokenDFI.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchMaxAccountDfi);
      expect(handleFetchTokenDFI).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchMaxAccountDfiFailure(errorObj.message)]);
    });
  });
});
