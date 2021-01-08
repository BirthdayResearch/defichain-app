import { call, put, takeLatest, take } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import { syncStatusRequest, syncStatusSuccess } from './reducer';
import { getBlockSyncInfo } from './service';
import { eventChannel, END } from 'redux-saga';
import { SYNC_TIMEOUT, SYNC_INFO_RETRY_ATTEMPT } from '../../constants';

function* blockSyncInfo() {
  const chan = yield call(fetchBlockSyncInfo, SYNC_INFO_RETRY_ATTEMPT);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const res = yield take(chan);
      yield put(syncStatusSuccess(res));
    }
  } catch (e) {
    // yield put(syncStatusFailure(e.message));
    log.error(e);
  } finally {
    const e = new Error('Error Occurred');
    log.error(e);
  }
}

function fetchBlockSyncInfo(retryAttempt: number) {
  return eventChannel((emitter) => {
    const intervalRef = setInterval(async () => {
      try {
        const res = await getBlockSyncInfo();
        // reset retry attempt on success
        retryAttempt = SYNC_INFO_RETRY_ATTEMPT;
        emitter(res);
      } catch (err) {
        retryAttempt--;
        log.error(err, 'fetchBlockSyncInfo');
        // this causes the channel to close
        if (!retryAttempt) {
          emitter(END);
        }
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
