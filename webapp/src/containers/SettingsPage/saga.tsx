import { call, put, takeLatest } from 'redux-saga/effects';
import {
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
} from './settings.service';
import store from '../../app/rootStore';
import { setupI18n } from '../../translations/i18n';
import { LANG_VARIABLE } from '../../constants';

function* getSettings() {
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
    console.log(e);
  }
}

function* updateSettings(action) {
  try {
    let updateLanguage = false;
    if (
      localStorage.getItem(LANG_VARIABLE) !==
      action.payload.settings.settingsLanguage
    ) {
      updateLanguage = true;
    }
    const data = yield call(updateSettingsData, action.payload.settings);
    if (data && data.settings) {
      if (updateLanguage) {
        setupI18n(store);
      }
      if (data.settings.settingsLaunchAtLogin) {
        enablePreLaunchStatus(data.settings.settingsMinimizedAtLaunch);
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
    console.log(e);
  }
}

function* mySaga() {
  yield takeLatest(getInitialSettingsRequest.type, getSettings);
  yield takeLatest(updateSettingsRequest.type, updateSettings);
}

export default mySaga;
