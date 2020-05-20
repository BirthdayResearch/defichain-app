import isElectron from 'is-electron';
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
} from '../../constants';
import showNotification from '../../utils/notifications';
import { I18n } from 'react-redux-i18n';
import PersistentStore from '../../utils/persistentStore';

export const initialData = () => {
  const launchStat = getPreLaunchStatus();
  const settings = {
    settingsLanguage: PersistentStore.get(LANG_VARIABLE) || 'en',
    settingsAmountsUnit: PersistentStore.get(AMOUNTS_UNIT) || 'DFI',
    settingDisplayMode: PersistentStore.get(DISPLAY_MODE) || 'same_as_system',
    settingsLaunchAtLogin: launchStat,
    settingsMinimizedAtLaunch:
      launchStat && PersistentStore.get(LAUNCH_MINIMIZED) === 'true',
    settingsPruneBlockStorage:
      PersistentStore.get(PRUNE_BLOCK_STORAGE) === 'true',
    settingsScriptVerificationThreads:
      parseInt(`${PersistentStore.get(SCRIPT_VERIFICATION)}`, 10) || 0,
    settingBlockStorage:
      parseInt(`${PersistentStore.get(BLOCK_STORAGE)}`, 10) || '',
    settingsDatabaseCache:
      parseInt(`${PersistentStore.get(DATABASE_CACHE)}`, 10) || '',
  };
  return { settings };
};

export const updateSettingsData = settingsData => {
  PersistentStore.set(LANG_VARIABLE, settingsData.settingsLanguage);
  PersistentStore.set(AMOUNTS_UNIT, settingsData.settingsAmountsUnit);
  PersistentStore.set(DISPLAY_MODE, settingsData.settingDisplayMode);
  PersistentStore.set(LAUNCH_AT_LOGIN, settingsData.settingsLaunchAtLogin);
  PersistentStore.set(LAUNCH_MINIMIZED, settingsData.settingsMinimizedAtLaunch);
  PersistentStore.set(
    PRUNE_BLOCK_STORAGE,
    settingsData.settingsPruneBlockStorage
  );
  PersistentStore.set(
    SCRIPT_VERIFICATION,
    settingsData.settingsScriptVerificationThreads
  );
  PersistentStore.set(BLOCK_STORAGE, settingsData.settingBlockStorage);
  PersistentStore.set(DATABASE_CACHE, settingsData.settingsDatabaseCache);
  return { settings: settingsData };
};

const getPreLaunchStatus = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require('electron');
    const res = ipcRenderer.sendSync('prelaunch-preference-status', {});
    if (res.success && res.data) {
      return res.data.enabled;
    }
    showNotification(I18n.t('alerts.errorOccurred'), res.message);
    return false;
  }
  return false;
};

export const enablePreLaunchStatus = (minimize = false) => {
  if (isElectron()) {
    const { ipcRenderer } = window.require('electron');
    const res = ipcRenderer.sendSync('prelaunch-preference-enable', {
      minimize,
    });
    if (res.success && res.data) {
      return res.data.enabled;
    }
    showNotification(I18n.t('alerts.errorOccurred'), res.message);
    return false;
  }
  return false;
};

export const disablePreLaunchStatus = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require('electron');
    const res = ipcRenderer.sendSync('prelaunch-preference-disable', {});
    if (res.success && res.data) {
      return res.data.enabled;
    }
    showNotification(I18n.t('alerts.errorOccurred'), res.message);
    return false;
  }
  return false;
};
