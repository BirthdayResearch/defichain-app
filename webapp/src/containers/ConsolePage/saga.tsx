import { takeLatest, call, put } from 'redux-saga/effects';
import {
  fetchDataForQueryRequest,
  fetchDataForQuerySuccess,
  fetchDataForQueryFailure,
} from './reducer';
import { handleDataForQuery } from './service';
import log from 'loglevel';

export function* fetchDataForQuery(action) {
  const { query } = action.payload;
  try {
    const data = yield call(handleDataForQuery, query);
    yield put(fetchDataForQuerySuccess(data));
  } catch (e) {
    yield put({ type: fetchDataForQueryFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchDataForQueryRequest.type, fetchDataForQuery);
}
export default mySaga;
