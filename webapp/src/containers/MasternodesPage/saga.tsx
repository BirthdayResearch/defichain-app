import { call, put, takeLatest } from 'redux-saga/effects';
import log from 'loglevel';
import {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
} from './reducer';
import { handelFetchMasterNodes } from './service';

function* fetchMasterNodes() {
  try {
    const data = yield call(handelFetchMasterNodes);
    if (data && data.masternodes) {
      yield put({ type: fetchMasternodesSuccess.type, payload: { ...data } });
    } else {
      yield put({
        type: fetchMasternodesFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: fetchMasternodesFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
}

export default mySaga;
