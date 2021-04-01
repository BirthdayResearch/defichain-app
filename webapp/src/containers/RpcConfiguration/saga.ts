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
  startSetNodeVersion,
} from './reducer';
import {
  getRpcConfig,
  setNodeVersion,
  startAppInit,
  startBinary,
} from '../../app/service';
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
  setIsQueueResetRoute,
  openWalletPassphraseModal,
} from '../PopOver/reducer';
import {
  fetchPaymentRequest,
  fetchWalletMapSuccess,
  lockWalletStart,
} from '../WalletPage/reducer';
import { fetchChainInfo } from '../WalletPage/saga';
import { enableMenuResetWalletBtn } from '../../app/update.ipcRenderer';
import { history } from '../../utils/history';
import { WALLET_TOKENS_PATH } from '../../constants';
import { WalletMap } from '../../../../typings/walletMap';
import { RootState } from '../../app/rootTypes';
import { fetchMasterNodes } from '../MasternodesPage/saga';
import { hasAnyMasternodeEnabled } from '../MasternodesPage/service';

function* blockChainNotStarted(message) {
  const { isRunning } = yield select((state) => state.app);
  if (!isRunning) {
    log.error(`${message ?? ''}`, 'blockChainNotStarted - Not Running');
    yield put(startNodeFailure(message));
  } else {
    log.error(`Node is disconnected`, 'blockChainNotStarted - Running');
    yield put(openErrorModal());
  }
}

function* resetAppRoute() {
  const { isQueueResetRoute } = yield select((state) => state.popover);
  if (isQueueResetRoute) {
    yield put(setIsQueueResetRoute(false));
    history.push(WALLET_TOKENS_PATH);
  }
}

export function* getConfig() {
  try {
    startAppInit();
    const res = yield call(getRpcConfig);
    if (res?.success) {
      yield put({ type: getRpcConfigsSuccess.type, payload: res.data });
      yield put({ type: startNodeRequest.type });
      if (isElectron()) {
        const chan = yield call(startBinary, res.data);
        while (true) {
          const blockchainStatus = yield take(chan);
          log.info(blockchainStatus, 'Blockchain Status');
          if (blockchainStatus.status) {
            yield put(startNodeSuccess());
            yield put(closeRestartLoader());
            yield put(storeConfigurationData(blockchainStatus.conf));
            yield put(closeErrorModal());
            yield put(setQueueReady());
            yield call(resetAppRoute);
          } else {
            yield call(blockChainNotStarted, blockchainStatus.message);
          }
        }
      } else {
        yield put(startNodeSuccess());
      }
    } else {
      const resMessage = res.message || 'No data found';
      showNotification(I18n.t('alerts.configurationFailure'), resMessage);
      yield put({
        type: getRpcConfigsFailure.type,
        payload: resMessage,
      });
      log.error(resMessage, 'getConfig');
    }
  } catch (e) {
    showNotification(I18n.t('alerts.configurationFailure'), e.message);
    yield put({ type: getRpcConfigsFailure.type, payload: e.message });
    log.error(e, 'getConfig');
  }
}

export function* preCheck() {
  yield call(fetchChainInfo);
  yield put(fetchPaymentRequest());
  const { isWalletCreatedFlag } = yield select((state) => state.wallet);
  yield call(enableMenuResetWalletBtn, isWalletCreatedFlag);
  //* MN lock step
  if (isWalletCreatedFlag) {
    yield call(fetchMasterNodes);
    const { myMasternodes } = yield select(
      (state: RootState) => state.masterNodes
    );
    if (hasAnyMasternodeEnabled(myMasternodes)) {
      yield put(lockWalletStart());
      yield put(openWalletPassphraseModal());
    }
  }
}

export function* handleSetNodeVersion() {
  try {
    const walletMap: WalletMap = yield call(setNodeVersion);
    if (walletMap) {
      yield put(fetchWalletMapSuccess(walletMap));
    }
  } catch (error) {
    log.error(error, 'handleSetNodeVersion');
  }
}

function* mySaga() {
  yield takeLatest(getRpcConfigsRequest.type, getConfig);
  yield takeLatest(startNodeSuccess.type, preCheck);
  yield takeLatest(startSetNodeVersion.type, handleSetNodeVersion);
}

export default mySaga;
