import { call, put, takeLatest, take, cancelled } from 'redux-saga/effects';
import logger, * as log from '../../utils/electronLogger';
import {
  syncStatusRequest,
  syncStatusSuccess,
  setBlockChainInfo,
} from './reducer';
import { getBlockSyncInfo, getBlockChainInfo } from './service';
import { eventChannel, END } from 'redux-saga';
import { SYNC_TIMEOUT, RETRY_ATTEMPT } from '../../constants';

function* blockSyncInfo() {
  const chan = yield call(fetchBlockSyncInfo, RETRY_ATTEMPT);
  yield call(fetchChainInfo);
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

function* fetchChainInfo() {
  let result;
  try {
    const data = yield call(getBlockChainInfo);
    result = data;
  } catch (err) {
    log.error(err.message);
    result = {};
  }
  yield put(setBlockChainInfo(result));
}

function fetchBlockSyncInfo(retryAttempt: number) {
  return eventChannel((emitter) => {
    const intervalRef = setInterval(async () => {
      try {
        const res = await getBlockSyncInfo();
        // reset retry attempt on success
        retryAttempt = RETRY_ATTEMPT;
        emitter(res);
      } catch (err) {
        retryAttempt--;
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
