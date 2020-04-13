import { createSlice } from "@reduxjs/toolkit";
import {
  enablePreLaunchStatus,
  disablePreLaunchStatus,
} from "./settings.service";

const configSlice = createSlice({
  name: "settings",
  initialState: {
    isFetching: false,
    settingsError: "Unsupported language.",
    settings: {
      settingsLanguage: "",
      settingsAmountsUnit: "",
      settingDisplayMode: "",
      settingsLaunchAtLogin: false,
      settingsMinimizedAtLaunch: false,
      settingsPruneBlockStorage: false,
      settingsScriptVerificationThreads: 0,
      settingBlockStorage: "",
      settingsDatabaseCache: "",
    },
    isUpdating: false,
    isUpdated: false,
    languages: [
      { label: "english", value: "en" },
      { label: "german", value: "de" },
    ],
    amountUnits: [
      { label: "dFI", value: "DFI" },
      { label: "µDFI", value: "µDFI" },
    ],
    displayModes: [
      {
        label: "sameAsSystem",
        value: "same_as_system",
      },
      { label: "light", value: "light" },
      { label: "dark", value: "dark" },
    ],
  },
  reducers: {
    getInitialSettingsRequest(state) {
      state.isFetching = true;
    },
    getInitialSettingsSuccess(state, action) {
      state.settings = action.payload.settings;
      state.isFetching = false;
      state.settingsError = "";
    },
    getInitialSettingsFailure(state, action) {
      state.isFetching = false;
      state.settingsError = action.payload;
    },
    updateSettingsRequest(state) {
      state.isUpdating = true;
    },
    updateSettingsSuccess(state, action) {
      const {
        settingsLaunchAtLogin,
        settingsMinimizedAtLaunch,
      } = action.payload.settings;
      if (
        state.settings.settingsLaunchAtLogin !== settingsLaunchAtLogin ||
        state.settings.settingsMinimizedAtLaunch !== settingsMinimizedAtLaunch
      ) {
        if (settingsLaunchAtLogin) {
          enablePreLaunchStatus(settingsMinimizedAtLaunch);
        } else {
          disablePreLaunchStatus();
        }
      }
      state.settings = action.payload.settings;
      state.isUpdating = false;
      state.settingsError = "";
    },
    updateSettingsFailure(state, action) {
      state.isUpdating = false;
      state.settingsError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  getInitialSettingsRequest,
  getInitialSettingsSuccess,
  getInitialSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
} = actions;

export default reducer;
