import { takeLatest } from 'redux-saga/effects';
import mySaga, {
  fetchBlocks,
  fetchBlockCount,
  fetchBlockData,
  fetchTxns,
} from '../saga';
import {
  fetchBlocksRequest,
  fetchTxnsRequest,
  fetchBlockDataRequest,
  fetchBlockCountRequest,
} from '../reducer';

const errorObj = {
  message: 'error occurred',
};

describe('Liquidity page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every fetchBlocksRequest action and call fetchBlocks', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchBlocksRequest.type, fetchBlocks)
    );
  });

  it('should wait for every fetchBlockCountRequest action and call fetchBlockCount', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchBlockCountRequest.type, fetchBlockCount)
    );
  });

  it('should wait for every fetchBlockDataRequest action and call fetchBlockData', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchBlockDataRequest.type, fetchBlockData)
    );
  });

  it('should wait for every fetchTxnsRequest action and call fetchTxns', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTxnsRequest.type, fetchTxns)
    );
  });
});
