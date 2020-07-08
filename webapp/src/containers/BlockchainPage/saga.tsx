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

export function* fetchBlocks(action) {
  const { currentPage: pageNo, pageSize } = action.payload;
  try {
    const data = yield call(handelFetchBlocks, pageNo, pageSize);
    if (data && data.blocks) {
      yield put({ type: fetchBlocksSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchBlocksFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchBlocksFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchBlockData(action) {
  const { blockNumber } = action.payload;
  try {
    const data = yield call(handleFetchBlockData, blockNumber);
    if (data && data.blockData) {
      yield put({ type: fetchBlockDataSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchBlockDataFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchBlockDataFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchBlockCount() {
  try {
    const data = yield call(handleFetchBlockCount);
    if (data && data.blockCount) {
      yield put({ type: fetchBlockCountSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchBlockCountFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchBlockCountFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* fetchTxns(action) {
  const { blockNumber, pageNo, pageSize } = action.payload;
  try {
    const data = yield call(handelFetchTxns, blockNumber, pageNo, pageSize);
    if (data && data.txns) {
      yield put({ type: fetchTxnsSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchTxnsFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchTxnsFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchBlocksRequest.type, fetchBlocks);
  yield takeLatest(fetchBlockCountRequest.type, fetchBlockCount);
  yield takeLatest(fetchBlockDataRequest.type, fetchBlockData);
  yield takeLatest(fetchTxnsRequest.type, fetchTxns);
}

export default mySaga;
