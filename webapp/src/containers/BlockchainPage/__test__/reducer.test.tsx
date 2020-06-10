import reducer, {
  initialState,
  fetchBlocksRequest,
  fetchBlocksSuccess,
  fetchBlocksFailure,
  fetchBlockDataRequest,
  fetchBlockDataSuccess,
  fetchBlockDataFailure,
  fetchBlockCountSuccess,
  fetchBlockCountFailure,
  fetchTxnsRequest,
  fetchTxnsSuccess,
  fetchTxnsFailure,
} from '../reducer';
import { expected, fetchBlockDataRequestTestData } from './testData.json';

describe('wallet slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchBlocksRequest reducers and actions', () => {
    it('should have empty paymentRequest information when fetchBlocksRequest is made', () => {
      const currentPage = 1;
      const pageSize = 10;
      const nextState = reducer(
        initialState,
        fetchBlocksRequest({ currentPage, pageSize })
      );
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blocks).toEqual([]);
      expect(rootState.blockchain.isLoadingBlocks).toBeTruthy();
    });
    it('should propely set paymentRequest information when fetchBlocksSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchBlocksSuccess(expected.handelFetchBlocks)
      );
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blocks).toEqual(
        expected.handelFetchBlocks.blocks
      );
      expect(rootState.blockchain.blockCount).toEqual(
        expected.handelFetchBlocks.blockCount
      );
      expect(rootState.blockchain.isLoadingBlocks).toBe(false);
      expect(rootState.blockchain.isBlocksLoaded).toBe(true);
    });
    it('should have empty paymentRequest information when fetchBlocksFailure is made', () => {
      const nextState = reducer(initialState, fetchBlocksFailure({}));
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blocks).toEqual([]);
      expect(rootState.blockchain.blockCount).toEqual(0);
      expect(rootState.blockchain.isLoadingBlocks).toBe(false);
      expect(rootState.blockchain.isBlocksLoaded).toBe(true);
    });
  });

  describe('fetchBlockDataRequest reducers and actions', () => {
    it('should properly set isLoadingBlockData information when fetchBlockDataRequest is made', () => {
      const nextState = reducer(initialState, fetchBlockDataRequest({}));
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blockData).toEqual(
        fetchBlockDataRequestTestData
      );
      expect(rootState.blockchain.isLoadingBlockData).toEqual(true);
    });

    it('should propely set blockData, isLoadingBlockData information when fetchBlockDataSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchBlockDataSuccess(expected.handleFetchBlockData)
      );
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blockData).toEqual(
        expected.handleFetchBlockData.blockData
      );
      expect(rootState.blockchain.isLoadingBlockData).toEqual(false);
    });

    it('should properly set blockDataError, isLoadingBlockData information when fetchBlockDataFailure is made', () => {
      const nextState = reducer(initialState, fetchBlockDataFailure({}));
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blockDataError).toEqual({});
      expect(rootState.blockchain.isLoadingBlockData).toEqual(false);
    });
  });

  describe('fetchBlockCountRequest reducers and actions', () => {
    // tslint:disable-next-line: max-line-length
    it('should properly set blockCount information when fetchBlockCountSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchBlockCountSuccess(expected.handleFetchBlockCount)
      );
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blockCount).toEqual(
        expected.handleFetchBlockCount.blockCount
      );
    });

    it('should properly set blockCountError information when fetchBlockCountFailure is made', () => {
      const error = new Error('Error while fetching block count');
      const payload = error.message;
      const nextState = reducer(initialState, fetchBlockCountFailure(payload));
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.blockCountError).toEqual(payload);
    });
  });

  describe('fetchTxnsRequest reducers and actions', () => {
    // tslint:disable-next-line: max-line-length
    it('should properly set isLoadingTxns, isTxnsLoaded and txnsLoadError information when fetchTxnsRequest is made', () => {
      const blockNumber = 101;
      const pageNo = 11;
      const pageSize = 10;
      const nextState = reducer(
        initialState,
        fetchTxnsRequest({ blockNumber, pageNo, pageSize })
      );
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.isLoadingTxns).toBe(true);
      expect(rootState.blockchain.isTxnsLoaded).toBe(false);
      expect(rootState.blockchain.txnsLoadError).toBe('');
    });
    // tslint:disable-next-line: max-line-length
    it('should properly set txns, txnCount, isLoadingTxns and isTxnsLoaded information when fetchTxnsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchTxnsSuccess(expected.handelFetchTxns)
      );
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.txns).toEqual(expected.handelFetchTxns.txns);
      expect(rootState.blockchain.txnCount).toEqual(
        expected.handelFetchTxns.txnCount
      );
      expect(rootState.blockchain.isLoadingTxns).toEqual(false);
      expect(rootState.blockchain.isTxnsLoaded).toEqual(true);
    });
    it('should properly set txns, txnCount, txnsLoadError, isLoadingTxns, isTxnsLoaded information when fetchTxnsFailure is made', () => {
      const error = new Error('Error while fetching txn');
      const payload = error.message;
      const nextState = reducer(initialState, fetchTxnsFailure(payload));
      const rootState = { blockchain: nextState };
      expect(rootState.blockchain.txns).toEqual([]);
      expect(rootState.blockchain.txnCount).toEqual(0);
      expect(rootState.blockchain.txnsLoadError).toEqual(payload);
      expect(rootState.blockchain.isLoadingTxns).toEqual(false);
      expect(rootState.blockchain.isTxnsLoaded).toEqual(true);
    });
  });
});
