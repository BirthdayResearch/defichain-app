import { call, put, takeLatest } from 'redux-saga/effects';

import * as log from '../../utils/electronLogger';
import {
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolsharesFailure, fetchPoolPairListRequest, fetchTokenBalanceListRequest, fetchTokenBalanceListSuccess, fetchPoolPairListSuccess
} from './reducer';
import { handleFetchPoolPairList, handleFetchPoolshares, handleFetchTokenBalanceList } from './service';

function* fetchPoolshares() {
  try {
    const data = yield call(handleFetchPoolshares);
    yield put({
      type: fetchPoolsharesSuccess.type,
      payload: { poolshares: data },
    });
  } catch (e) {
    yield put({
      type: fetchPoolsharesFailure.type,
      payload: e.message,
    });
    log.error(e);
  }
}

function* fetchTokenBalanceList() {
  try {
    const data = yield call(handleFetchTokenBalanceList);
    yield put({ type: fetchTokenBalanceListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

function* fetchPoolPairList() {
  try {
    const data = yield call(handleFetchPoolPairList);
    yield put({ type: fetchPoolPairListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchPoolsharesRequest.type, fetchPoolshares);
  yield takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList);
  yield takeLatest(fetchTokenBalanceListRequest.type, fetchTokenBalanceList);
}

export default mySaga;
