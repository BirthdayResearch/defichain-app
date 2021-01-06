import { takeLatest } from 'redux-saga/effects';
import * as testData from './testData.json';
import mySaga, {
  fetchPoolshares,
  fetchPoolPairList,
  fetchPoolPair,
  fetchTokenBalanceList,
  addPoolLiquidity,
  removePoolLiquidity,
  fetchUtxoDfi,
  fetchMaxAccountDfi,
} from '../saga';
import {
  fetchPoolpair,
  fetchPoolpairSuccess,
  fetchPoolpairFailure,
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolPairListRequest,
  fetchPoolPairListSuccess,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  addPoolLiquidityRequest,
  addPoolLiquiditySuccess,
  addPoolLiquidityFailure,
  removePoolLiqudityRequest,
  removePoolLiquiditySuccess,
  removePoolLiquidityFailure,
  fetchUtxoDfiRequest,
  fetchUtxoDfiSuccess,
  fetchUtxoDfiFailure,
  fetchMaxAccountDfiRequest,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} from '../reducer';
import * as utility from '../../../utils/utility';
import * as service from '../service';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

const errorObj = {
  message: 'error occurred',
};

describe('Liquidity page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every fetchPoolsharesRequest action and call fetchPoolshares', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPoolsharesRequest.type, fetchPoolshares)
    );
  });

  it('should wait for every fetchPoolPairListRequest action and call fetchPoolPairList', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList)
    );
  });

  it('should wait for every fetchPoolpair action and call fetchPoolPair', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchPoolpair.type, fetchPoolPair)
    );
  });

  it('should wait for every fetchTokenBalanceListRequest action and call fetchTokenBalanceList', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList)
    );
  });

  it('should wait for every addPoolLiquidityRequest action and call addPoolLiquidity', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(addPoolLiquidityRequest.type, addPoolLiquidity)
    );
  });

  it('should wait for every removePoolLiqudityRequest action and call removePoolLiquidity', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(removePoolLiqudityRequest.type, removePoolLiquidity)
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

  describe('fetchPoolshares', () => {
    let handleFetchPoolshares;
    beforeEach(() => {
      handleFetchPoolshares = jest.spyOn(service, 'handleFetchPoolshares');
    });
    afterEach(() => {
      handleFetchPoolshares.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchPoolshares.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchPoolshares)
      );
      await dispatchedFunc(fetchPoolshares);
      expect(handleFetchPoolshares).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchPoolshares.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchPoolshares);
      expect(handleFetchPoolshares).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchPoolsharesSuccess({
          poolshares: [],
        }),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchPoolshares.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchPoolshares);
      expect(handleFetchPoolshares).toBeCalledTimes(1);
      // expect(dispatched).toEqual([fetchPoolsharesFailure(errorObj.message)]);
    });
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

  describe('fetchPoolPair', () => {
    let handleFetchPoolpair;
    beforeEach(() => {
      handleFetchPoolpair = jest.spyOn(service, 'handleFetchPoolpair');
    });
    afterEach(() => {
      handleFetchPoolpair.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchPoolpair.mockImplementation(() =>
        Promise.resolve(testData.poolPairList)
      );
      await dispatchedFunc(fetchPoolPair);
      expect(handleFetchPoolpair).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchPoolpair.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchPoolPair);
      expect(handleFetchPoolpair).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchPoolpairSuccess({ poolpair: [] })]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchPoolpair.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchPoolPair);
      expect(handleFetchPoolpair).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchPoolpairFailure(errorObj.message)]);
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

  describe('addPoolLiquidity', () => {
    let handleAddPoolLiquidity;
    beforeEach(() => {
      handleAddPoolLiquidity = jest.spyOn(service, 'handleAddPoolLiquidity');
    });
    afterEach(() => {
      handleAddPoolLiquidity.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleAddPoolLiquidity.mockImplementation(() =>
        Promise.resolve(testData.saga.handleAddPoolLiquidity)
      );
      await dispatchedFunc(addPoolLiquidity);
      expect(handleAddPoolLiquidity).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleAddPoolLiquidity.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(addPoolLiquidity);
      expect(handleAddPoolLiquidity).toBeCalledTimes(1);
      expect(dispatched).toEqual([addPoolLiquiditySuccess([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handleAddPoolLiquidity.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(addPoolLiquidity);
      expect(handleAddPoolLiquidity).toBeCalledTimes(1);
      expect(dispatched).toEqual([addPoolLiquidityFailure(errorObj.message)]);
    });
  });

  describe('removePoolLiquidity', () => {
    let handleRemovePoolLiquidity;
    beforeEach(() => {
      handleRemovePoolLiquidity = jest.spyOn(
        service,
        'handleRemovePoolLiquidity'
      );
    });
    afterEach(() => {
      handleRemovePoolLiquidity.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleRemovePoolLiquidity.mockImplementation(() =>
        Promise.resolve(testData.saga.handleRemovePoolLiquidity)
      );
      await dispatchedFunc(removePoolLiquidity);
      expect(handleRemovePoolLiquidity).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleRemovePoolLiquidity.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(removePoolLiquidity);
      expect(handleRemovePoolLiquidity).toBeCalledTimes(1);
      expect(dispatched).toEqual([removePoolLiquiditySuccess([])]);
    });

    it('should call api and dispatch failure action', async () => {
      handleRemovePoolLiquidity.mockImplementation(() =>
        Promise.reject(errorObj)
      );
      const dispatched = await dispatchedFunc(removePoolLiquidity);
      expect(handleRemovePoolLiquidity).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        removePoolLiquidityFailure(errorObj.message),
      ]);
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
