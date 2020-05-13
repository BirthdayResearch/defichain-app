import { call, put, takeLatest, take } from 'redux-saga/effects';
import log from 'loglevel';
import {
  syncStatusRequest,
  syncStatusSuccess,
  syncStatusFailure,
} from './reducer';
import { getBlockSyncInfo } from './service';
import { eventChannel, END } from 'redux-saga';
import { SYNC_TIMEOUT } from '../../constants';

function* blockSyncInfo() {
  const chan = yield call(fetchBlockSyncInfo);
  try {
    const res = yield call(getBlockSyncInfo);
    yield put(syncStatusSuccess(res));
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const res = yield take(chan);
      yield put(syncStatusSuccess(res));
    }
  } catch (e) {
    yield put(syncStatusFailure(e.message));
    log.error(e);
  } finally {
    const e = new Error('Error Occurred');
    yield put(syncStatusFailure(e.message));
    log.error(e);
  }
}

function fetchBlockSyncInfo() {
  return eventChannel(emitter => {
    const intervalRef = setInterval(async () => {
      try {
        const res = await getBlockSyncInfo();
        emitter(res);
      } catch (err) {
        // this causes the channel to close
        emitter(END);
      }
    }, SYNC_TIMEOUT);
    return () => {
      clearInterval(intervalRef);
    };
  });
}

function* mySaga() {
  yield takeLatest(syncStatusRequest.type, blockSyncInfo);
}

export default mySaga;
