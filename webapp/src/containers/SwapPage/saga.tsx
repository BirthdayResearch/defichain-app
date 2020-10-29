import { call, put, takeLatest, select, all } from 'redux-saga/effects';

import * as log from '../../utils/electronLogger';
import { fetchPoolPairListRequest, fetchPoolPairListSuccess } from './reducer';
import { handleFetchPoolPairList } from './service';

function* fetchPoolPairList() {
  try {
    const data = yield call(handleFetchPoolPairList);
    yield put({ type: fetchPoolPairListSuccess.type, payload: data });
  } catch (e) {
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchPoolPairListRequest.type, fetchPoolPairList);
}

export default mySaga;
