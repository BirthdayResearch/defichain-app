import { isElectron, ipcRendererFunc } from '../../utils/isElectron';
import { I18n } from 'react-redux-i18n';
import * as log from '../../utils/electronLogger';
import {
  LANG_VARIABLE,
  UNIT,
  DISPLAY_MODE,
  LAUNCH_AT_LOGIN,
  LAUNCH_MINIMIZED,
  PRUNE_BLOCK_STORAGE,
  SCRIPT_VERIFICATION,
  BLOCK_STORAGE,
  DATABASE_CACHE,
  ENGLISH,
  GERMAN,
  SAME_AS_SYSTEM_DISPLAY,
  LIGHT_DISPLAY,
  DARK_DISPLAY,
  DEFAULT_UNIT,
  DFI_UNIT_MAP,
  MAXIMUM_AMOUNT,
  MAXIMUM_COUNT,
  FEE_RATE,
  DEFAULT_MAXIMUM_AMOUNT,
  DEFAULT_MAXIMUM_COUNT,
  DEFAULT_FEE_RATE,
  MAINNET,
  TESTNET,
  // REGTEST,
} from '../../constants';
import showNotification from '../../utils/notifications';
import PersistentStore from '../../utils/persistentStore';

export const getLanguage = () => {
  return [
    { label: 'containers.settings.english', value: ENGLISH },
    { label: 'containers.settings.german', value: GERMAN },
  ];
};

export const getAmountUnits = () => {
  return Object.keys(DFI_UNIT_MAP).map((eachUnit) => {
    return { label: eachUnit, value: eachUnit };
  });
};

export const getDisplayModes = () => {
  return [
    {
      label: 'containers.settings.sameAsSystem',
      value: SAME_AS_SYSTEM_DISPLAY,
    },
    { label: 'containers.settings.light', value: LIGHT_DISPLAY },
    { label: 'containers.settings.dark', value: DARK_DISPLAY },
  ];
};

export const getNetWorkList = () => {
  return [
    {
      label: 'containers.settings.mainnet',
      value: MAINNET,
    },
    { label: 'containers.settings.testnet', value: TESTNET },
    // { label: 'containers.settings.regnet', value: REGTEST },
  ];
};

export const initialData = () => {
  const launchStat = getPreLaunchStatus();
  const settings = {
    language: PersistentStore.get(LANG_VARIABLE) || ENGLISH,
    unit: getAppConfigUnit(),
    displayMode: PersistentStore.get(DISPLAY_MODE) || SAME_AS_SYSTEM_DISPLAY,
    launchAtLogin: launchStat,
    minimizedAtLaunch:
      launchStat && PersistentStore.get(LAUNCH_MINIMIZED) === 'true',
    pruneBlockStorage: PersistentStore.get(PRUNE_BLOCK_STORAGE) === 'true',
    scriptVerificationThreads:
      parseInt(`${PersistentStore.get(SCRIPT_VERIFICATION)}`, 10) || 0,
    blockStorage: parseInt(`${PersistentStore.get(BLOCK_STORAGE)}`, 10) || '',
    databaseCache: parseInt(`${PersistentStore.get(DATABASE_CACHE)}`, 10) || '',
    maximumAmount: getAppConfigMaximumAmount(),
    maximumCount: getAppConfigMaximumCount(),
    feeRate: getAppConfigFeeRate(),
  };
  return settings;
};

export const updateSettingsData = (settingsData) => {
  PersistentStore.set(LANG_VARIABLE, settingsData.language);
  PersistentStore.set(UNIT, settingsData.unit);
  PersistentStore.set(DISPLAY_MODE, settingsData.displayMode);
  PersistentStore.set(LAUNCH_AT_LOGIN, settingsData.launchAtLogin);
  PersistentStore.set(LAUNCH_MINIMIZED, settingsData.minimizedAtLaunch);
  PersistentStore.set(PRUNE_BLOCK_STORAGE, settingsData.pruneBlockStorage);
  PersistentStore.set(
    SCRIPT_VERIFICATION,
    settingsData.scriptVerificationThreads
  );
  PersistentStore.set(BLOCK_STORAGE, settingsData.blockStorage);
  PersistentStore.set(DATABASE_CACHE, settingsData.databaseCache);
  PersistentStore.set(MAXIMUM_AMOUNT, settingsData.maximumAmount);
  PersistentStore.set(MAXIMUM_COUNT, settingsData.maximumCount);
  PersistentStore.set(FEE_RATE, settingsData.feeRate);
  return settingsData;
};

const getPreLaunchStatus = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
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
    const ipcRenderer = ipcRendererFunc();
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
    const ipcRenderer = ipcRendererFunc();
    const res = ipcRenderer.sendSync('prelaunch-preference-disable', {});
    if (res.success && res.data) {
      return res.data.enabled;
    }
    showNotification(I18n.t('alerts.errorOccurred'), res.message);
    return false;
  }
  return false;
};

export const getAppConfigUnit = () => {
  const unit = PersistentStore.get(UNIT);
  if (unit && Object.keys(DFI_UNIT_MAP).indexOf(unit) > -1) {
    return unit;
  }
  log.error(new Error('Error in selected unit, setting it to default one'));
  PersistentStore.set(UNIT, DEFAULT_UNIT);
  return DEFAULT_UNIT;
};

export const getAppConfigMaximumAmount = () => {
  const maximumAmount = PersistentStore.get(MAXIMUM_AMOUNT);
  if (maximumAmount) return maximumAmount;

  PersistentStore.set(MAXIMUM_AMOUNT, DEFAULT_MAXIMUM_AMOUNT);
  return DEFAULT_MAXIMUM_AMOUNT;
};

export const getAppConfigMaximumCount = () => {
  const maximumCount = PersistentStore.get(MAXIMUM_COUNT);
  if (maximumCount) return maximumCount;

  PersistentStore.set(MAXIMUM_COUNT, DEFAULT_MAXIMUM_COUNT);
  return DEFAULT_MAXIMUM_COUNT;
};

export const getAppConfigFeeRate = () => {
  const feeRate = PersistentStore.get(FEE_RATE);
  if (feeRate) return feeRate;

  PersistentStore.set(FEE_RATE, DEFAULT_FEE_RATE);
  return DEFAULT_FEE_RATE;
};
