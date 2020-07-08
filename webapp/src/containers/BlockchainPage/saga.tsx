import { call, put, takeLatest } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  fetchBlocksRequest,
  fetchBlocksSuccess,
  fetchBlocksFailure,
  fetchTxnsRequest,
  fetchTxnsSuccess,
  fetchTxnsFailure,
  fetchBlockDataRequest,
  fetchBlockDataFailure,
  fetchBlockDataSuccess,
  fetchBlockCountRequest,
  fetchBlockCountSuccess,
  fetchBlockCountFailure,
} from './reducer';
import {
  handelFetchTxns,
  handelFetchBlocks,
  handleFetchBlockData,
  handleFetchBlockCount,
} from './service';
import store from '../../app/rootStore';
import queue from '../../worker/queue';

function fetchBlocks(action) {
  const { currentPage: pageNo, pageSize } = action.payload;
  queue.push(
    { methodName: handelFetchBlocks, params: [pageNo, pageSize] },
    (err, result) => {
      if (err) {
        store.dispatch(fetchBlocksFailure(err.message));
        log.error(err);
        return;
      }
      if (result && result.blocks)
        store.dispatch(fetchBlocksSuccess({ ...result }));
      else {
        store.dispatch(fetchBlocksFailure('No data found'));
      }
    }
  );
}

function fetchBlockData(action) {
  const { blockNumber } = action.payload;
  queue.push(
    { methodName: handleFetchBlockData, params: [blockNumber] },
    (err, result) => {
      if (err) {
        store.dispatch(fetchBlockDataFailure(err.message));
        log.error(err);
        return;
      }
      if (result && result.blockData)
        store.dispatch(fetchBlockDataSuccess({ ...result }));
      else {
        store.dispatch(fetchBlockDataFailure('No data found'));
      }
    }
  );
}

function fetchBlockCount() {
  queue.push(
    { methodName: handleFetchBlockCount, params: [] },
    (err, result) => {
      if (err) {
        store.dispatch(fetchBlockCountFailure(err.message));
        log.error(err);
        return;
      }
      if (result && result.blockCount)
        store.dispatch(fetchBlockCountSuccess({ ...result }));
      else {
        store.dispatch(fetchBlockCountFailure('No data found'));
      }
    }
  );
}

function fetchTxns(action) {
  const { blockNumber, pageNo, pageSize } = action.payload;
  queue.push(
    { methodName: handelFetchTxns, params: [blockNumber, pageNo, pageSize] },
    (err, result) => {
      if (err) {
        store.dispatch(fetchTxnsFailure(err.message));
        log.error(err);
        return;
      }
      if (result && result.txns)
        store.dispatch(fetchTxnsSuccess({ ...result }));
      else {
        store.dispatch(fetchTxnsFailure('No data found'));
      }
    }
  );
}

function* mySaga() {
  yield takeLatest(fetchBlocksRequest.type, fetchBlocks);
  yield takeLatest(fetchBlockCountRequest.type, fetchBlockCount);
  yield takeLatest(fetchBlockDataRequest.type, fetchBlockData);
  yield takeLatest(fetchTxnsRequest.type, fetchTxns);
}

export default mySaga;