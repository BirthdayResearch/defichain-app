import { call, put, takeLatest } from 'redux-saga/effects';
import log from 'loglevel';
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
} from './service';
import store from '../../app/rootStore';
import { setupI18n } from '../../translations/i18n';
import { LANG_VARIABLE } from '../../constants';
import PersistentStore from '../../utils/persistentStore';

export function* getSettingsOptions() {
  try {
    const languages = yield call(getLanguage);
    const amountUnits = yield call(getAmountUnits);
    const displayModes = yield call(getDisplayModes);
    yield put(
      getSettingOptionsSuccess({ languages, amountUnits, displayModes })
    );
  } catch (e) {
    yield put(getSettingOptionsFailure(e.message));
    log.error(e);
  }
}

export function* getSettings() {
  try {
    const data = yield call(initialData);
    if (data) {
      yield put({ type: getInitialSettingsSuccess.type, payload: { ...data } });
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

function* mySaga() {
  yield takeLatest(getSettingOptionsRequest.type, getSettingsOptions);
  yield takeLatest(getInitialSettingsRequest.type, getSettings);
  yield takeLatest(updateSettingsRequest.type, updateSettings);
}

export default mySaga;
