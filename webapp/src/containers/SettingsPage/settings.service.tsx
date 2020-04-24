import isElectron from "is-electron";
import {
  LANG_VARIABLE,
  AMOUNTS_UNIT,
  DISPLAY_MODE,
  LAUNCH_AT_LOGIN,
  LAUNCH_MINIMIZED,
  PRUNE_BLOCK_STORAGE,
  SCRIPT_VERIFICATION,
  BLOCK_STORAGE,
  DATABASE_CACHE,
} from "../../constants";

export const initialData = () => {
  const launchStat = getPreLaunchStatus();
  let settings = {
    settingsLanguage: localStorage.getItem(LANG_VARIABLE) || "en",
    settingsAmountsUnit: localStorage.getItem(AMOUNTS_UNIT) || "DFI",
    settingDisplayMode: localStorage.getItem(DISPLAY_MODE) || "same_as_system",
    settingsLaunchAtLogin: launchStat,
    settingsMinimizedAtLaunch:
      launchStat && localStorage.getItem(LAUNCH_MINIMIZED) === "true",
    settingsPruneBlockStorage:
      localStorage.getItem(PRUNE_BLOCK_STORAGE) === "true",
    settingsScriptVerificationThreads:
      parseInt(localStorage.getItem(SCRIPT_VERIFICATION) + "") || 0,
    settingBlockStorage:
      parseInt(localStorage.getItem(BLOCK_STORAGE) + "") || "",
    settingsDatabaseCache:
      parseInt(localStorage.getItem(DATABASE_CACHE) + "") || "",
  };
  return { settings };
};

export const updateSettingsData = (settingsData) => {
  localStorage.setItem(LANG_VARIABLE, settingsData.settingsLanguage);
  localStorage.setItem(AMOUNTS_UNIT, settingsData.settingsAmountsUnit);
  localStorage.setItem(DISPLAY_MODE, settingsData.settingDisplayMode);
  localStorage.setItem(LAUNCH_AT_LOGIN, settingsData.settingsLaunchAtLogin);
  localStorage.setItem(
    LAUNCH_MINIMIZED,
    settingsData.settingsMinimizedAtLaunch
  );
  localStorage.setItem(
    PRUNE_BLOCK_STORAGE,
    settingsData.settingsPruneBlockStorage
  );
  localStorage.setItem(
    SCRIPT_VERIFICATION,
    settingsData.settingsScriptVerificationThreads
  );
  localStorage.setItem(BLOCK_STORAGE, settingsData.settingBlockStorage);
  localStorage.setItem(DATABASE_CACHE, settingsData.settingsDatabaseCache);
  return { settings: settingsData };
};

const getPreLaunchStatus = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("prelaunch-preference-status", {});
    if (res.success && res.data) {
      return res.data.enabled;
    }
    alert(res.message);
    return false;
  }
  return false;
};

export const enablePreLaunchStatus = (minimize = false) => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("prelaunch-preference-enable", {
      minimize,
    });
    if (res.success && res.data) {
      return res.data.enabled;
    }
    alert(res.message);
    return false;
  }
  return false;
};

export const disablePreLaunchStatus = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("prelaunch-preference-disable", {});
    if (res.success && res.data) {
      return res.data.enabled;
    }
    alert(res.message);
    return false;
  }
  return false;
};
