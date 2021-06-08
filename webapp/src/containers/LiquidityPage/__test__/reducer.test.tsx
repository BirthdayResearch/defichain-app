import reducer, {
  initialState,
  fetchPoolpair,
  fetchPoolpairSuccess,
  fetchPoolpairFailure,
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolsharesFailure,
  fetchPoolPairListRequest,
  fetchPoolPairListSuccess,
  fetchPoolPairListFailure,
  fetchTokenBalanceListRequest,
  fetchTokenBalanceListSuccess,
  fetchTokenBalanceListFailure,
  addPoolLiquidityRequest,
  addPoolPreparingUTXOSuccess,
  addPoolLiquiditySuccess,
  addPoolLiquidityFailure,
  removePoolLiqudityRequest,
  removePoolLiquiditySuccess,
  removePoolLiquidityFailure,
  refreshUTXOS1Success,
  liquidityRemovedSuccess,
  refreshUTXOS2Success,
  transferTokensSuccess,
  fetchUtxoDfiRequest,
  fetchUtxoDfiSuccess,
  fetchUtxoDfiFailure,
  fetchMaxAccountDfiRequest,
  fetchMaxAccountDfiSuccess,
  fetchMaxAccountDfiFailure,
} from '../reducer';
import * as payload from './testData.json';

describe('liquidity slice', () => {
  const nextState = initialState;
  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchPoolpair reducers and actions', () => {
    it('should be check  isLoadingPoolpair', () => {
      const nextState = reducer(initialState, fetchPoolpair({}));
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingPoolpair).toBeTruthy();
    });

    it('should be check for fetchPoolpairSuccess', () => {
      const poolpair = payload.poolpair;
      const nextState = reducer(
        initialState,
        fetchPoolpairSuccess({ poolpair })
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.poolpair).toEqual(payload.poolpair);
      expect(rootState.liquidity.isLoadingPoolpair).toBeFalsy();
      expect(rootState.liquidity.isPoolpairLoaded).toBeTruthy();
    });

    it('should be check for fetchPoolpairFailure', () => {
      const poolpair = {};
      const nextState = reducer(
        initialState,
        fetchPoolpairFailure({ poolpair })
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.poolpair).toEqual(poolpair);
      expect(rootState.liquidity.isLoadingPoolpair).toBeFalsy();
      expect(rootState.liquidity.isPoolpairLoaded).toBeTruthy();
    });
  });

  describe('fetchPoolsharesRequest reducers and actions', () => {
    it('should be check  isLoadingPoolshares', () => {
      const nextState = reducer(initialState, fetchPoolsharesRequest());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingPoolshares).toBeTruthy();
    });
  });

  describe('fetchPoolsharesSuccess reducers and actions', () => {
    it('should be check for fetchPoolsharesSuccess', () => {
      const poolshares = [];
      const nextState = reducer(
        initialState,
        fetchPoolsharesSuccess({ poolshares })
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.poolshares).toEqual(poolshares);
      expect(rootState.liquidity.isLoadingPoolshares).toBeFalsy();
      expect(rootState.liquidity.isPoolsharesLoaded).toBeTruthy();
    });

    it('should be check for fetchPoolsharesFailure', () => {
      const nextState = reducer(initialState, fetchPoolsharesFailure());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.poolshares).toEqual([]);
      expect(rootState.liquidity.isLoadingPoolshares).toBeFalsy();
      expect(rootState.liquidity.isPoolsharesLoaded).toBeTruthy();
    });
  });

  describe('fetchPoolPairList reducers and actions', () => {
    it('should be check fetchPoolPairListRequest', () => {
      const nextState = reducer(initialState, fetchPoolPairListRequest());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingPoolPairList).toBeTruthy();
    });

    it('should be check fetchPoolPairListSuccess', () => {
      const nextState = reducer(
        initialState,
        fetchPoolPairListSuccess(payload.poolPairList)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.poolPairList).toEqual(payload.poolPairList);
      expect(rootState.liquidity.isLoadingPoolPairList).toBeFalsy();
    });

    it('should be check fetchPoolPairListFailure', () => {
      const nextState = reducer(initialState, fetchPoolPairListFailure());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingPoolPairList).toBeFalsy();
    });
  });

  describe('fetchTokenBalance reducers and actions', () => {
    it('should be check fetchTokenBalanceListRequest', () => {
      const nextState = reducer(initialState, fetchTokenBalanceListRequest());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingTokenBalanceList).toBeTruthy();
    });

    it('should be check fetchTokenBalanceListSuccess', () => {
      const nextState = reducer(initialState, fetchTokenBalanceListSuccess([]));
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.tokenBalanceList).toEqual([]);
      expect(rootState.liquidity.isLoadingTokenBalanceList).toBeFalsy();
    });

    it('should be check fetchTokenBalanceListFailure', () => {
      const nextState = reducer(initialState, fetchTokenBalanceListFailure());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingTokenBalanceList).toBeFalsy();
    });
  });

  describe('addPoolLiquidity reducers and actions', () => {
    it('should be check addPoolLiquidityRequest', () => {
      const nextState = reducer(
        initialState,
        addPoolLiquidityRequest({ payload: {} })
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingAddPoolLiquidity).toBeTruthy();
      expect(rootState.liquidity.isLoadingPreparingUTXO).toBeTruthy();
      expect(rootState.liquidity.isAddPoolLiquidityLoaded).toBeFalsy();
      expect(rootState.liquidity.isErrorAddingPoolLiquidity).toEqual('');
      expect(rootState.liquidity.addPoolLiquidityHash).toEqual('');
    });

    it('should be check addPoolPreparingUTXOSuccess', () => {
      const nextState = reducer(initialState, addPoolPreparingUTXOSuccess());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingPreparingUTXO).toBeFalsy();
      expect(rootState.liquidity.isLoadingAddingLiquidity).toBeTruthy();
      expect(rootState.liquidity.isAddPoolLiquidityLoaded).toBeFalsy();
    });

    it('should be check addPoolLiquiditySuccess', () => {
      const nextState = reducer(
        initialState,
        addPoolLiquiditySuccess(payload.addPoolLiquidityHash)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.addPoolLiquidityHash).toEqual(
        payload.addPoolLiquidityHash
      );
      expect(rootState.liquidity.isLoadingAddingLiquidity).toBeFalsy();
      expect(rootState.liquidity.isLoadingAddPoolLiquidity).toBeFalsy();
      expect(rootState.liquidity.isAddPoolLiquidityLoaded).toBeTruthy();
    });

    it('should be check addPoolLiquidityFailure', () => {
      const nextState = reducer(
        initialState,
        addPoolLiquidityFailure({ payload: {} })
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingAddingLiquidity).toBeFalsy();
      expect(rootState.liquidity.isLoadingAddPoolLiquidity).toBeFalsy();
      expect(rootState.liquidity.isAddPoolLiquidityLoaded).toBeTruthy();
    });

    it('should be check removePoolLiqudityRequest', () => {
      const nextState = reducer(
        initialState,
        removePoolLiqudityRequest({ payload: {} })
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingRemovePoolLiquidity).toBeTruthy();
      expect(rootState.liquidity.isLoadingRefreshUTXOS1).toBeTruthy();
      expect(rootState.liquidity.isRemovePoolLiquidityLoaded).toBeFalsy();
      expect(rootState.liquidity.refreshUTXOS1Loaded).toBeFalsy();
      expect(rootState.liquidity.liquidityRemovedLoaded).toBeFalsy();
      expect(rootState.liquidity.refreshUTXOS2Loaded).toBeFalsy();
      expect(rootState.liquidity.transferTokensLoaded).toBeFalsy();
      expect(rootState.liquidity.isErrorRemovingPoolLiquidity).toEqual('');
      expect(rootState.liquidity.removePoolLiquidityHash).toEqual('');
    });

    it('should be check refreshUTXOS1Success', () => {
      const nextState = reducer(initialState, refreshUTXOS1Success());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.refreshUTXOS1Loaded).toBeTruthy();
      expect(rootState.liquidity.isLoadingRefreshUTXOS1).toBeFalsy();
      expect(rootState.liquidity.isLoadingLiquidityRemoved).toBeTruthy();
    });

    it('should be check liquidityRemovedSuccess', () => {
      const nextState = reducer(initialState, liquidityRemovedSuccess());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.liquidityRemovedLoaded).toBeTruthy();
      expect(rootState.liquidity.isLoadingLiquidityRemoved).toBeFalsy();
      expect(rootState.liquidity.isLoadingRefreshUTXOS2).toBeTruthy();
    });

    it('should be check refreshUTXOS2Success', () => {
      const nextState = reducer(initialState, refreshUTXOS2Success());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.refreshUTXOS2Loaded).toBeTruthy();
      expect(rootState.liquidity.isLoadingRefreshUTXOS2).toBeFalsy();
      expect(rootState.liquidity.isLoadingTransferTokens).toBeTruthy();
    });

    it('should be check transferTokensSuccess', () => {
      const nextState = reducer(initialState, transferTokensSuccess());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.transferTokensLoaded).toBeTruthy();
      expect(rootState.liquidity.isLoadingTransferTokens).toBeFalsy();
    });

    it('should be check removePoolLiquiditySuccess', () => {
      const nextState = reducer(
        initialState,
        removePoolLiquiditySuccess(payload.removePoolLiquidityHash)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isLoadingRemovePoolLiquidity).toBeFalsy();
      expect(rootState.liquidity.isRemovePoolLiquidityLoaded).toBeTruthy();
    });

    it('should be check removePoolLiquidityFailure', () => {
      const nextState = reducer(
        initialState,
        removePoolLiquidityFailure(payload.isErrorRemovingPoolLiquidity)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isErrorRemovingPoolLiquidity).toEqual(
        payload.isErrorRemovingPoolLiquidity
      );
      expect(rootState.liquidity.isLoadingRemovePoolLiquidity).toBeFalsy();
      expect(rootState.liquidity.isRemovePoolLiquidityLoaded).toBeTruthy();
    });
  });

  describe('fetchUtxoDfi reducers and actions', () => {
    it('should be check fetchUtxoDfiRequest', () => {
      const nextState = reducer(initialState, fetchUtxoDfiRequest());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isUtxoDfiFetching).toBeTruthy();
      expect(rootState.liquidity.isUtxoDfiError).toEqual('');
    });

    it('should be check fetchUtxoDfiSuccess', () => {
      const nextState = reducer(
        initialState,
        fetchUtxoDfiSuccess(payload.utxoDfi)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.utxoDfi).toEqual(payload.utxoDfi);
      expect(rootState.liquidity.isUtxoDfiFetching).toBeFalsy();
      expect(rootState.liquidity.isUtxoDfiError).toEqual('');
    });

    it('should be check fetchUtxoDfiFailure', () => {
      const nextState = reducer(
        initialState,
        fetchUtxoDfiFailure(payload.isUtxoDfiError)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.utxoDfi).toEqual(0);
      expect(rootState.liquidity.isUtxoDfiFetching).toBeFalsy();
      expect(rootState.liquidity.isUtxoDfiError).toEqual(
        payload.isUtxoDfiError
      );
    });
  });

  describe('fetchMaxAccountDfi reducers and actions', () => {
    it('should be check fetchMaxAccountDfiRequest', () => {
      const nextState = reducer(initialState, fetchMaxAccountDfiRequest());
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.isMaxAccountDfiFetching).toBeTruthy();
      expect(rootState.liquidity.isMaxAccountDfiError).toEqual('');
    });

    it('should be check fetchMaxAccountDfiSuccess', () => {
      const nextState = reducer(
        initialState,
        fetchMaxAccountDfiSuccess(payload.maxAccountDfi)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.maxAccountDfi).toEqual(payload.maxAccountDfi);
      expect(rootState.liquidity.isMaxAccountDfiFetching).toBeFalsy();
      expect(rootState.liquidity.isMaxAccountDfiError).toEqual('');
    });

    it('should be check fetchMaxAccountDfiFailure', () => {
      const nextState = reducer(
        initialState,
        fetchMaxAccountDfiFailure(payload.MaxAccountDfiError)
      );
      const rootState = { liquidity: nextState };
      expect(rootState.liquidity.maxAccountDfi).toEqual(0);
      expect(rootState.liquidity.isMaxAccountDfiFetching).toBeFalsy();
    });
  });
});
