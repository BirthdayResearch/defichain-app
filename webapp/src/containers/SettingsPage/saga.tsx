import { call, put, takeLatest, select, delay } from 'redux-saga/effects';
import * as log from '../../utils/electronLogger';
import {
  getSettingOptionsRequest,
  getSettingOptionsSuccess,
  getSettingOptionsFailure,
  getInitialSettingsRequest,
  getInitialSettingsSuccess,
  getInitialSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
  changePassphraseRequest,
  changePassphraseFailure,
  changePassphraseSuccess,
  setDefaultLockTimeout,
  reindexRequest,
} from './reducer';
import {
  updateSettingsData,
  initialData,
  enablePreLaunchStatus,
  disablePreLaunchStatus,
  getLanguage,
  getAmountUnits,
  getDisplayModes,
  getNetWorkList,
  refreshUtxosAfterSavingData,
  changePassphrase,
  updateLockTimeout,
} from './service';
import store from '../../app/rootStore';
import { setupI18n } from '../../translations/i18n';
import { LANG_VARIABLE, MAIN, TEST, WALLET_TOKENS_PATH } from '../../constants';
import PersistentStore from '../../utils/persistentStore';
import { restartNode } from '../../utils/isElectron';
import { openWalletPassphraseModal, restartModal } from '../PopOver/reducer';
import { shutDownNode } from '../../worker/queue';
import {
  MAINNET,
  TESTNET,
  DEFAULT_MAINNET_CONNECT,
  DEFAULT_TESTNET_CONNECT,
  DEFAULT_MAINNET_PORT,
  DEFAULT_TESTNET_PORT,
  BLOCKCHAIN_INFO_CHAIN_MAINNET,
  BLOCKCHAIN_INFO_CHAIN_TEST,
} from '../../constants';
import { fetchWalletMapRequest, lockWalletStart } from '../WalletPage/reducer';
import { history } from '../../utils/history';
import { remapNodeError } from '../../utils/utility';
import { CONFIG_DISABLED, CONFIG_ENABLED } from '@defi_types/rpcConfig';
import { updateActiveNetwork } from '../RpcConfiguration/reducer';
import { RootState } from '../../app/rootTypes';
import showNotification from '../../utils/notifications';
import { I18n } from 'react-redux-i18n';
import lruCache from 'src/utils/lruCache';

export function* getSettingsOptions() {
  try {
    const languages = yield call(getLanguage);
    const amountUnits = yield call(getAmountUnits);
    const displayModes = yield call(getDisplayModes);
    const networkOptions = yield call(getNetWorkList);
    yield put(
      getSettingOptionsSuccess({
        languages,
        amountUnits,
        displayModes,
        networkOptions,
      })
    );
  } catch (e: any) {
    yield put(getSettingOptionsFailure(e.message));
    log.error(e);
  }
}

export function* getSettings() {
  const {
    blockChainInfo: { chain },
  } = yield select((state) => state.wallet);
  let network = '';
  if (chain === BLOCKCHAIN_INFO_CHAIN_TEST) {
    network = TESTNET;
  }
  if (chain === BLOCKCHAIN_INFO_CHAIN_MAINNET) {
    network = MAINNET;
  }
  try {
    const data = yield call(initialData);
    if (data) {
      yield put({
        type: getInitialSettingsSuccess.type,
        payload: { ...data, network },
      });
    } else {
      yield put({
        type: getInitialSettingsFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e: any) {
    yield put({ type: getInitialSettingsFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* updateSettings(action) {
  try {
    let updateLanguage = false;
    const {
      appConfig: { network: prevNetwork, launchAtLogin: prevLaunchAtLogin },
    } = yield select((state) => state.settings);
    if (PersistentStore.get(LANG_VARIABLE) !== action.payload.language) {
      updateLanguage = true;
    }
    const data = yield call(updateSettingsData, action.payload);
    if (data) {
      if (updateLanguage) {
        setupI18n(store);
      }
      if (data.launchAtLogin !== prevLaunchAtLogin) {
        if (data.launchAtLogin) {
          enablePreLaunchStatus(data.minimizedAtLaunch);
        } else {
          disablePreLaunchStatus();
        }
      }
      yield put({ type: updateSettingsSuccess.type, payload: { ...data } });
      if (action.payload.network !== prevNetwork) {
        yield call(changeNetworkNode, action.payload.network);
      }
      if (data.reindexAfterSaving) {
        yield put(restartModal());
        yield call(shutDownNode);
        yield call(restartNode, {
          isReindexReq: true,
          isDeletePeersAndBlocksreq: data.deletePeersAndBlocks,
        });
      }
      if (data.refreshUtxosAfterSaving) {
        yield call(refreshUtxosAfterSavingData);
      }

      if (data.timeoutValue) {
        yield put(setDefaultLockTimeout(data.timeoutValue));
      }

      if (
        PersistentStore.get('sendCountdown') !== action.payload.sendCountdown
      ) {
        PersistentStore.set('sendCountdown', data.sendCountdown);
      } else {
        PersistentStore.set('sendCountdown', true);
      }
    } else {
      yield put({
        type: updateSettingsFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e: any) {
    yield put({ type: updateSettingsFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* changeNetworkNode(networkName) {
  const { rpcConfig } = yield select((state: RootState) => state.app);
  const network = {
    regtest: CONFIG_DISABLED,
    testnet: CONFIG_DISABLED,
  };
  let name = MAIN;
  const config = {
    rpcbind: DEFAULT_MAINNET_CONNECT,
    rpcport: DEFAULT_MAINNET_PORT,
  };
  if (networkName === TESTNET) {
    network.testnet = CONFIG_ENABLED;
    name = TEST;
    config.rpcbind = DEFAULT_TESTNET_CONNECT;
    config.rpcport = DEFAULT_TESTNET_PORT;
  }
  const currentNetworkConfiguration = rpcConfig[name] || {};
  const updatedConf = Object.assign({}, rpcConfig, network, {
    [name]: { ...currentNetworkConfiguration, ...config },
  });
  // clear old cache
  lruCache.clear();
  yield put(updateActiveNetwork(name));
  yield put(restartModal());
  yield call(shutDownNode);
  yield call(restartNode, { updatedConf });
  yield put(fetchWalletMapRequest());
}

export function* updatePassphrase(action) {
  try {
    log.info('Starting update of passphrase...', 'updatePassphrase');
    const { currentPassphrase, passphrase } = action.payload;
    const resp = yield call(changePassphrase, currentPassphrase, passphrase);
    if (resp?.success) {
      yield put(changePassphraseSuccess(true));
      yield put(lockWalletStart());
      history.push(WALLET_TOKENS_PATH);
      yield put(openWalletPassphraseModal());
      log.info('Update of passphrase successful', 'updatePassphrase');
    } else {
      throw new Error(resp?.message);
    }
  } catch (error: any) {
    yield put({
      type: changePassphraseFailure.type,
      payload: remapNodeError(error.message),
    });
    log.error(error);
  }
}

export function* setLockTimeout(action) {
  try {
    log.info('Starting update of lock timeout...', 'setLockTimeout');
    const timeout = action.payload;
    const resp = yield call(updateLockTimeout, timeout);
    if (resp?.success) {
      const message = I18n.t('alerts.timeoutMessage', {
        timeout,
      });
      const title = I18n.t('alerts.timeoutTitle');
      log.info(message, title);
      return showNotification(title, message);
    }
    throw new Error(resp?.message);
  } catch (error: any) {
    yield put({
      type: changePassphraseFailure.type,
      payload: remapNodeError(error.message),
    });
    log.error(error);
  }
}

export function* handleReindexRequest() {
  yield put(restartModal());
  yield call(shutDownNode);
  yield call(restartNode, {
    isReindexReq: true,
    isDeletePeersAndBlocksreq: true,
  });
}

function* mySaga() {
  yield takeLatest(reindexRequest.type, handleReindexRequest);
  yield takeLatest(getSettingOptionsRequest.type, getSettingsOptions);
  yield takeLatest(getInitialSettingsRequest.type, getSettings);
  yield takeLatest(updateSettingsRequest.type, updateSettings);
  yield takeLatest(changePassphraseRequest.type, updatePassphrase);
  yield takeLatest(setDefaultLockTimeout.type, setLockTimeout);
}

export default mySaga;
