import { call, put, takeLatest, take } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import isElectron from 'is-electron';

import log from 'loglevel';
import {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
  startNodeRequest,
} from './reducer';
import { getRpcConfig, startBinary, startChain } from '../../app/service';
import showNotification from '../../utils/notifications';
import { I18n } from 'react-redux-i18n';
import { isBlockchainStarted } from './service';
import { DIFF, RETRY_ATTEMPT } from '../../constants';

function isConnected(retryAttempt) {
  return eventChannel(emitter => {
    const blockchainStatusTimerID = setInterval(async () => {
      retryAttempt -= 1;
      if (retryAttempt > 0) {
        if (isElectron()) {
          const status = await isBlockchainStarted();
          emitter(status);
        }
        // For webapp
        emitter(true);
      } else if (retryAttempt === 0 || status) {
        emitter(END);
      }
    }, DIFF);
    return () => {
      clearInterval(blockchainStatusTimerID);
    };
  });
}

function* getConfig() {
  const channel = yield call(isConnected, RETRY_ATTEMPT);
  try {
    const res = yield call(getRpcConfig);
    if (res.success) {
      yield put({ type: getRpcConfigsSuccess.type, payload: res.data });
      yield put({ type: startNodeRequest.type, payload: res.data });

      yield call(startChain, res.data);

      while (true) {
        const status = yield take(channel);

        if (status) {
          yield call(startBinary, res.data);
          channel.close();
        }
      }
    } else {
      showNotification(I18n.t('alerts.configurationFailure'), res.message);
      yield put({
        type: getRpcConfigsFailure.type,
        payload: res.message || 'No data found',
      });
    }
  } catch (e) {
    showNotification(I18n.t('alerts.configurationFailure'), e.message);
    yield put({ type: getRpcConfigsFailure.type, payload: e.message });
    log.error(e);
    channel.close();
  }
}

function* mySaga() {
  yield takeLatest(getRpcConfigsRequest.type, getConfig);
}

export default mySaga;
