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
} from './service';
import store from '../../app/rootStore';
import { setupI18n } from '../../translations/i18n';
import { LANG_VARIABLE } from '../../constants';
import PersistentStore from '../../utils/persistentStore';
import { restartNode } from '../../utils/isElectron';
import { restartModal } from '../ErrorModal/reducer';
import q from '../../worker/queue';
import {
  MAINNET,
  TESTNET,
  REGTEST,
  DEFAULT_MAINNET_CONNECT,
  DEFAULT_TESTNET_CONNECT,
  DEFAULT_REGTEST_CONNECT,
  DEFAULT_MAINNET_PORT,
  DEFAULT_TESTNET_PORT,
  DEFAULT_REGTEST_PORT,
} from '../../constants';

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
  } catch (e) {
    yield put(getSettingOptionsFailure(e.message));
    log.error(e);
  }
}

export function* getSettings() {
  const {
    blockChainInfo: { chain },
  } = yield select((state) => state.syncstatus);
  let network = MAINNET;
  console.log({ chain });
  if (chain === 'test') {
    network = TESTNET;
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
  } catch (e) {
    yield put({ type: getInitialSettingsFailure.type, payload: e.message });
    log.error(e);
  }
}

export function* updateSettings(action) {
  try {
    let updateLanguage = false;
    if (PersistentStore.get(LANG_VARIABLE) !== action.payload.language) {
      updateLanguage = true;
    }
    const data = yield call(updateSettingsData, action.payload);
    if (data) {
      if (updateLanguage) {
        setupI18n(store);
      }
      if (data.launchAtLogin) {
        enablePreLaunchStatus(data.minimizedAtLaunch);
      } else {
        disablePreLaunchStatus();
      }
      yield put({ type: updateSettingsSuccess.type, payload: { ...data } });
      if (action.payload.network) {
        console.log(action.payload.network);
        yield call(changeNetworkNode, action.payload.network);
      }
    } else {
      yield put({
        type: updateSettingsFailure.type,
        payload: 'No data found',
      });
    }
  } catch (e) {
    yield put({ type: updateSettingsFailure.type, payload: e.message });
    log.error(e);
  }
}

function* changeNetworkNode(networkName) {
  const { configurationData } = yield select((state) => state.app);
  const network = {
    regtest: 0,
    testnet: 0,
  };
  let name = 'main';
  const config = {
    rpcbind: DEFAULT_MAINNET_CONNECT,
    rpcport: DEFAULT_MAINNET_PORT,
  };
  if (networkName === TESTNET) {
    network.testnet = 1;
    name = 'test';
    config.rpcbind = DEFAULT_TESTNET_CONNECT;
    config.rpcport = DEFAULT_TESTNET_PORT;
  }
  // if (networkName === REGTEST) {
  //   network.regtest = 1;
  //   name = 'regtest';
  //   config.rpcbind = DEFAULT_MAINNET_CONNECT;
  //   config.rpcport = DEFAULT_MAINNET_PORT;
  // }
  const updatedConf = Object.assign({}, configurationData, network, {
    [name]: config,
  });
  yield put(restartModal());
  yield call(q.kill);
  yield delay(2000);
  yield call(restartNode, { updatedConf });
}

function* mySaga() {
  yield takeLatest(getSettingOptionsRequest.type, getSettingsOptions);
  yield takeLatest(getInitialSettingsRequest.type, getSettings);
  yield takeLatest(updateSettingsRequest.type, updateSettings);
}

export default mySaga;
