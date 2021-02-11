import reducer, {
  initialState,
  fetchPoolPairListRequest,
  fetchPoolPairListSuccess,
  fetchPoolPairListFailure,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchTokenBalanceListFailure,
  resetTestPoolSwapRequestTo,
  fetchTestPoolSwapRequestTo,
  fetchTestPoolSwapSuccessTo,
  resetTestPoolSwapErrorTo,
  resetTestPoolSwapRequestFrom,
  fetchTestPoolSwapRequestFrom,
  fetchTestPoolSwapSuccessFrom,
  resetTestPoolSwapErrorFrom,
  poolSwapRequest,
  poolSwapRefreshUTXOSuccess,
  poolSwapSuccess,
  poolSwapFailure,
  fetchUtxoDfiRequest,
  fetchUtxoDfiSuccess,
  fetchUtxoDfiFailure,
  fetchMaxAccountDfiRequest,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
  fetchTestPoolSwapFailureTo,
  fetchTestPoolSwapFailureFrom,
} from '../reducer';
import * as payload from './testData.json';

describe('swap slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchPoolPairList reducers and actions', () => {
    it('should be check fetchPoolPairListRequest ', () => {
      const nextState = reducer(initialState, fetchPoolPairListRequest());
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingPoolPairList).toBeTruthy();
    });
    it('should propely set PoolPair information when fetchPoolPairListSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchPoolPairListSuccess(payload.poolPairList)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.poolPairList).toEqual(payload.poolPairList);
      expect(rootState.swap.isLoadingPoolPairList).toBeFalsy();
    });
    it('should be check fetchPoolPairListFailure', () => {
      const nextState = reducer(initialState, fetchPoolPairListFailure());
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingPoolPairList).toBeFalsy();
    });
  });

  describe('fetchTokenBalanceList reducers and actions', () => {
    it('should be check fetchPoolPairListRequest ', () => {
      const nextState = reducer(initialState, fetchTokenBalanceListRequest());
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingTokenBalanceList).toBeTruthy();
    });
    it('should propely set TokenBalanceList information when fetchTokenBalanceListSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchTokenBalanceListSuccess(payload.tokenBalanceList)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.tokenBalanceList).toEqual(payload.tokenBalanceList);
      expect(rootState.swap.isLoadingTokenBalanceList).toBeFalsy();
    });
    it('should be check fetchTokenBalanceListFailure', () => {
      const nextState = reducer(initialState, fetchTokenBalanceListFailure());
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingTokenBalanceList).toBeFalsy();
    });
  });

  describe('TestPoolSwap To reducers and actions', () => {
    it('should be check resetTestPoolSwapRequestTo ', () => {
      const nextState = reducer(initialState, resetTestPoolSwapRequestTo());
      const rootState = { swap: nextState };
      expect(rootState.swap.testPoolSwapTo).toEqual('');
    });
    it('should be check fetchTestPoolSwapRequestTo ', () => {
      const nextState = reducer(
        initialState,
        fetchTestPoolSwapRequestTo({ payload: {} })
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingTestPoolSwapTo).toBeTruthy();
      expect(rootState.swap.isErrorTestPoolSwapTo).toEqual('');
      expect(rootState.swap.isTestPoolSwapLoadedTo).toBeFalsy();
    });
    it('should be check fetchTestPoolSwapSuccessTo', () => {
      const nextState = reducer(
        initialState,
        fetchTestPoolSwapSuccessTo(payload.testPoolSwap)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.testPoolSwapTo).toEqual(payload.testPoolSwap);
      expect(rootState.swap.isLoadingTestPoolSwapTo).toBeFalsy();
      expect(rootState.swap.isTestPoolSwapLoadedTo).toBeTruthy();
      expect(rootState.swap.isErrorTestPoolSwapTo).toEqual('');
    });

    it('should be check fetchTestPoolSwapFailureTo', () => {
      const nextState = reducer(
        initialState,
        fetchTestPoolSwapFailureTo(payload.isErrorTestPoolSwapTo)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.testPoolSwapTo).toEqual('');
      expect(rootState.swap.isLoadingTestPoolSwapTo).toBeFalsy();
      expect(rootState.swap.isTestPoolSwapLoadedTo).toBeTruthy();
      expect(rootState.swap.isErrorTestPoolSwapTo).toEqual(
        payload.isErrorTestPoolSwapTo
      );
    });

    it('should be check resetTestPoolSwapErrorTo ', () => {
      const nextState = reducer(initialState, resetTestPoolSwapErrorTo());
      const rootState = { swap: nextState };
      expect(rootState.swap.isErrorTestPoolSwapTo).toEqual('');
    });
  });

  describe('TestPoolSwap From reducers and actions', () => {
    it('should be check resetTestPoolSwapRequestFrom ', () => {
      const nextState = reducer(initialState, resetTestPoolSwapRequestFrom());
      const rootState = { swap: nextState };
      expect(rootState.swap.testPoolSwapFrom).toEqual('');
    });

    it('should be check fetchTestPoolSwapRequestFrom ', () => {
      const nextState = reducer(
        initialState,
        fetchTestPoolSwapRequestFrom({ payload: {} })
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingTestPoolSwapFrom).toBeTruthy();
      expect(rootState.swap.isErrorTestPoolSwapFrom).toEqual('');
      expect(rootState.swap.isTestPoolSwapLoadedFrom).toBeFalsy();
    });

    it('should propely set fetchTestPoolSwapSuccessFrom information when  is made', () => {
      const nextState = reducer(
        initialState,
        fetchTestPoolSwapSuccessFrom(payload.testPoolSwapFrom)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.testPoolSwapFrom).toEqual(payload.testPoolSwapFrom);
      expect(rootState.swap.isLoadingTestPoolSwapFrom).toBeFalsy();
      expect(rootState.swap.isTestPoolSwapLoadedFrom).toBeTruthy();
      expect(rootState.swap.isErrorTestPoolSwapFrom).toEqual('');
    });

    it('should be check fetchTestPoolSwapFailureFrom ', () => {
      const nextState = reducer(
        initialState,
        fetchTestPoolSwapFailureFrom(payload.isErrorTestPoolSwapFrom)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.testPoolSwapFrom).toEqual('');
      expect(rootState.swap.isLoadingTestPoolSwapFrom).toBeFalsy();
      expect(rootState.swap.isTestPoolSwapLoadedFrom).toBeTruthy();
      expect(rootState.swap.isErrorTestPoolSwapFrom).toEqual(
        payload.isErrorTestPoolSwapFrom
      );
    });

    it('should be check resetTestPoolSwapErrorFrom ', () => {
      const nextState = reducer(initialState, resetTestPoolSwapErrorFrom());
      const rootState = { swap: nextState };
      expect(rootState.swap.isErrorTestPoolSwapFrom).toEqual('');
    });
  });

  describe('poolSwap reducers and actions', () => {
    it('should be check poolSwapRequest ', () => {
      const nextState = reducer(initialState, poolSwapRequest({ payload: {} }));
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingPoolSwap).toBeTruthy();
      expect(rootState.swap.isPoolSwapLoaded).toBeFalsy();
      expect(rootState.swap.poolSwapHash).toEqual('');
      expect(rootState.swap.isErrorPoolSwap).toEqual('');
      expect(rootState.swap.isLoadingRefreshUTXOS).toBeTruthy();
    });
    it('should be check poolSwapRefreshUTXOSuccess', () => {
      const nextState = reducer(initialState, poolSwapRefreshUTXOSuccess());
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingRefreshUTXOS).toBeFalsy();
      expect(rootState.swap.isLoadingTransferringTokens).toBeTruthy();
    });

    it('should be check poolSwapSuccess', () => {
      const nextState = reducer(
        initialState,
        poolSwapSuccess(payload.poolSwapHash)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingTransferringTokens).toBeFalsy();
      expect(rootState.swap.poolSwapHash).toEqual(payload.poolSwapHash);
      expect(rootState.swap.isLoadingPoolSwap).toBeFalsy();
      expect(rootState.swap.isPoolSwapLoaded).toBeTruthy();
    });

    it('should be check poolSwapFailure', () => {
      const nextState = reducer(
        initialState,
        poolSwapFailure(payload.poolSwapFailure)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.isLoadingTransferringTokens).toBeFalsy();
      expect(rootState.swap.isErrorPoolSwap).toEqual(payload.poolSwapFailure);
      expect(rootState.swap.isLoadingPoolSwap).toBeFalsy();
      expect(rootState.swap.isPoolSwapLoaded).toBeTruthy();
    });
  });

  describe('fetchUtxoDfi reducers and actions', () => {
    it('should be check fetchUtxoDfiRequest ', () => {
      const nextState = reducer(initialState, fetchUtxoDfiRequest());
      const rootState = { swap: nextState };
      expect(rootState.swap.isUtxoDfiFetching).toBeTruthy();
      expect(rootState.swap.isUtxoDfiError).toEqual('');
    });
    it('should propely set UtxoDfi  information when fetchUtxoDfiSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchUtxoDfiSuccess(payload.utxoDfi)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.utxoDfi).toEqual(payload.utxoDfi);
      expect(rootState.swap.isUtxoDfiFetching).toBeFalsy();
      expect(rootState.swap.isUtxoDfiError).toEqual('');
    });

    it('should be check fetchUtxoDfiFailure', () => {
      const nextState = reducer(
        initialState,
        fetchUtxoDfiFailure(payload.isUtxoDfiError)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.utxoDfi).toEqual(0);
      expect(rootState.swap.isUtxoDfiFetching).toBeFalsy();
      expect(rootState.swap.isUtxoDfiError).toEqual(payload.isUtxoDfiError);
    });
  });

  describe('fetchMaxAccountDfi reducers and actions', () => {
    it('should be check fetchMaxAccountDfiRequest ', () => {
      const nextState = reducer(initialState, fetchMaxAccountDfiRequest());
      const rootState = { swap: nextState };
      expect(rootState.swap.isMaxAccountDfiFetching).toBeTruthy();
      expect(rootState.swap.isMaxAccountDfiError).toEqual('');
    });

    it('should propely set MaxAccountDfi  information when fetchUtxoDfiSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchMaxAccountDfiSuccess(payload.MaxAccountDfi)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.maxAccountDfi).toEqual(payload.MaxAccountDfi);
      expect(rootState.swap.isMaxAccountDfiFetching).toBeFalsy();
      expect(rootState.swap.isMaxAccountDfiError).toEqual('');
    });

    it('should be check fetchMaxAccountDfiFailure', () => {
      const nextState = reducer(
        initialState,
        fetchMaxAccountDfiFailure(payload.isUtxoDfiError)
      );
      const rootState = { swap: nextState };
      expect(rootState.swap.maxAccountDfi).toEqual(0);
      expect(rootState.swap.isMaxAccountDfiFetching).toBeFalsy();
      expect(rootState.swap.isMaxAccountDfiError).toEqual(
        payload.isUtxoDfiError
      );
    });
  });
});
