import { call, put, takeLatest, take, delay } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  syncStatusFailure,
  syncStatusPeersFailure,
  syncStatusPeersLoading,
  syncStatusPeersRequest,
  syncStatusPeersSuccess,
  syncStatusRequest,
  syncStatusSuccess,
} from './reducer';
import { getBlockSyncInfo } from './service';
import { eventChannel, END } from 'redux-saga';
import { SYNC_TIMEOUT, SYNC_INFO_RETRY_ATTEMPT } from '../../constants';
import { handlePeersSyncRequest } from '../../utils/utility';

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

function* fetchPeersSyncInfo(action) {
  try {
    const peers = yield call(handlePeersSyncRequest, action?.payload);
    yield put(syncStatusPeersSuccess({ peers: peers?.length ?? 0 }));
    yield delay(3000);
    yield put(syncStatusPeersLoading({ isLoading: false }));
  } catch (error) {
    yield put(syncStatusPeersFailure({ error: error?.message }));
    log.error(error);
  }
}

function* mySaga() {
  yield takeLatest(syncStatusRequest.type, blockSyncInfo);
  yield takeLatest(syncStatusPeersRequest.type, fetchPeersSyncInfo);
}

export default mySaga;
