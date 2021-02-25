import { createSlice } from '@reduxjs/toolkit';
import { getAppConfigUnit } from './service';
import { SettingsState, TimeoutLockEnum } from './types';

export const initialState: SettingsState = {
  isFetching: false,
  settingsError: 'Unsupported language.',
  appConfig: {
    language: '',
    unit: getAppConfigUnit(),
    displayMode: '',
    network: '',
    launchAtLogin: false,
    minimizedAtLaunch: false,
    pruneBlockStorage: false,
    scriptVerificationThreads: 0,
    blockStorage: '',
    databaseCache: '',
  },
  isUpdating: false,
  isUpdated: false,
  languages: [],
  amountUnits: [],
  displayModes: [],
  networkOptions: [],
  isRefreshUtxosModalOpen: false,
  isPassphraseChanging: false,
  changePassphraseError: '',
  lockTimeoutList: [],
  defaultLockTimeout: TimeoutLockEnum.FIVE_MINUTES,
};

const configSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    getSettingOptionsRequest(state) {},
    getSettingOptionsSuccess(state, action) {
      state.languages = action.payload.languages;
      state.amountUnits = action.payload.amountUnits;
      state.displayModes = action.payload.displayModes;
      state.networkOptions = action.payload.networkOptions;
    },
    getSettingOptionsFailure(state, action) {
      state.languages = [];
      state.amountUnits = [];
      state.displayModes = [];
      state.networkOptions = [];
    },
    getInitialSettingsRequest(state) {
      state.isFetching = true;
    },
    getInitialSettingsSuccess(state, action) {
      state.appConfig = action.payload;
      state.isFetching = false;
      state.settingsError = '';
    },
    getInitialSettingsFailure(state, action) {
      state.isFetching = false;
      state.settingsError = action.payload;
    },
    updateSettingsRequest(state, action) {
      state.isUpdating = true;
    },
    updateSettingsSuccess(state, action) {
      state.appConfig = action.payload;
      state.isUpdating = false;
      state.settingsError = '';
    },
    updateSettingsFailure(state, action) {
      state.isUpdating = false;
      state.settingsError = action.payload;
    },
    refreshUtxosRequest(state) {
      state.isRefreshUtxosModalOpen = true;
    },
    refreshUtxosSuccess(state) {
      state.isRefreshUtxosModalOpen = false;
    },
    changePassphraseRequest(state, action) {
      state.isPassphraseChanging = true;
    },
    changePassphraseSuccess(state, action) {
      state.isPassphraseChanging = false;
      state.changePassphraseError = '';
    },
    changePassphraseFailure(state, action) {
      state.isPassphraseChanging = false;
      state.changePassphraseError = action.payload;
    },
    setDefaultLockTimeout(state, action) {
      state.defaultLockTimeout = action.payload;
    },
    setLockoutTimeList(state, action) {
      state.lockTimeoutList = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  getSettingOptionsRequest,
  getSettingOptionsSuccess,
  getSettingOptionsFailure,
  getInitialSettingsRequest,
  getInitialSettingsSuccess,
  getInitialSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
  refreshUtxosRequest,
  refreshUtxosSuccess,
  changePassphraseRequest,
  changePassphraseSuccess,
  changePassphraseFailure,
  setDefaultLockTimeout,
  setLockoutTimeList,
} = actions;

export default reducer;
