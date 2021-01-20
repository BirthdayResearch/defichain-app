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
import { queuePush } from '../../utils/utility';

export function fetchBlocks(action) {
  const { currentPage: pageNo, pageSize } = action.payload;
  const callBack = (err, result) => {
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
  };
  queuePush(handelFetchBlocks, [pageNo, pageSize], callBack);
}

export function fetchBlockData(action) {
  const { blockNumber } = action.payload;
  const callBack = (err, result) => {
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
  };
  queuePush(handleFetchBlockData, [blockNumber], callBack);
}

export function fetchBlockCount() {
  const callBack = (err, result) => {
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
  };
  queuePush(handleFetchBlockCount, [], callBack);
}

export function fetchTxns(action) {
  const { blockNumber, pageNo, pageSize } = action.payload;
  const callBack = (err, result) => {
    if (err) {
      store.dispatch(fetchTxnsFailure(err.message));
      log.error(err);
      return;
    }
    if (result && result.txns) store.dispatch(fetchTxnsSuccess({ ...result }));
    else {
      store.dispatch(fetchTxnsFailure('No data found'));
    }
  };
  queuePush(handelFetchTxns, [blockNumber, pageNo, pageSize], callBack);
}

function* mySaga() {
  yield takeLatest(fetchBlocksRequest.type, fetchBlocks);
  yield takeLatest(fetchBlockCountRequest.type, fetchBlockCount);
  yield takeLatest(fetchBlockDataRequest.type, fetchBlockData);
  yield takeLatest(fetchTxnsRequest.type, fetchTxns);
}

export default mySaga;
