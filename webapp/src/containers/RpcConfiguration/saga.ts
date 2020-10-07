import { call, put, takeLatest, take, select } from 'redux-saga/effects';
import { isElectron } from '../../utils/isElectron';
import * as log from '../../utils/electronLogger';
import {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
  startNodeRequest,
  storeConfigurationData,
  setQueueReady,
} from './reducer';
import { getRpcConfig, startBinary } from '../../app/service';
import showNotification from '../../utils/notifications';
import { I18n } from 'react-redux-i18n';
import {
  startNodeSuccess,
  startNodeFailure,
} from '../../containers/RpcConfiguration/reducer';
import {
  openErrorModal,
  closeErrorModal,
  closeRestartLoader,
} from '../PopOver/reducer';
import { fetchPaymentRequest } from '../WalletPage/reducer';
import { fetchChainInfo } from '../WalletPage/saga';

function* blockChainNotStarted(message) {
  const { isRunning } = yield select((state) => state.app);
  if (!isRunning) yield put(startNodeFailure(message));
  else yield put(openErrorModal());
}

export function* getConfig() {
  try {
    const res = yield call(getRpcConfig);
    if (res.success) {
      yield put({ type: getRpcConfigsSuccess.type, payload: res.data });
      yield put({ type: startNodeRequest.type });
      if (isElectron()) {
        const chan = yield call(startBinary, res.data);
        while (true) {
          const blockchainStatus = yield take(chan);
          if (blockchainStatus.status) {
            yield put(startNodeSuccess());
            yield put(closeRestartLoader());
            yield put(storeConfigurationData(blockchainStatus.conf));
            yield put(closeErrorModal());
            yield put(setQueueReady());
          } else {
            yield call(blockChainNotStarted, blockchainStatus.message);
          }
        }
      } else {
        yield put(startNodeSuccess());
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
  }
}

export function* preCheck() {
  yield call(fetchChainInfo);
  yield put(fetchPaymentRequest());
}

function* mySaga() {
  yield takeLatest(getRpcConfigsRequest.type, getConfig);
  yield takeLatest(startNodeSuccess.type, preCheck);
}

export default mySaga;
