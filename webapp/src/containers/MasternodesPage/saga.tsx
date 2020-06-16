import { call, put, takeLatest } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
  createMasterNode,
  createMasterNodeFailure,
  createMasterNodeSuccess,
  resignMasterNode,
  resignMasterNodeFailure,
  resignMasterNodeSuccess,
} from './reducer';
import {
  handelFetchMasterNodes,
  handelCreateMasterNodes,
  handleResignMasterNode,
} from './service';

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

function* createMasterNodes(action) {
  try {
    const {
      payload: { masterNodeName },
    } = action;
    const data = yield call(handelCreateMasterNodes, masterNodeName);
    yield put({ type: createMasterNodeSuccess.type, payload: { ...data } });
  } catch (e) {
    yield put({ type: createMasterNodeFailure.type, payload: e.message });
    log.error(e);
  }
}

function* masterNodeResign(action) {
  try {
    const {
      payload: { masterNodeHash },
    } = action;
    const data = yield call(handleResignMasterNode, masterNodeHash);
    yield put({ type: resignMasterNodeSuccess.type, payload: data });
  } catch (e) {
    yield put({ type: resignMasterNodeFailure.type, payload: e.message });
    log.error(e);
  }
}

function* mySaga() {
  yield takeLatest(fetchMasternodesRequest.type, fetchMasterNodes);
  yield takeLatest(createMasterNode.type, createMasterNodes);
  yield takeLatest(resignMasterNode.type, masterNodeResign);
}

export default mySaga;
