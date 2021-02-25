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
  FRENCH,
  CHINESE_SIMPLIFIED,
  CHINESE_TRADITIONAL,
  DUTCH,
  RUSSIAN,
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
  LIST_ACCOUNTS_PAGE_SIZE,
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  FI,
  // REGTEST,
} from '../../constants';
import showNotification from '../../utils/notifications';
import PersistentStore from '../../utils/persistentStore';
import RpcClient from '../../utils/rpc-client';
import {
  fetchAccountsDataWithPagination,
  getErrorMessage,
  getNetworkType,
} from '../../utils/utility';
import compact from 'lodash/compact';
import { refreshUtxosRequest, refreshUtxosSuccess } from './reducer';
import store from '../../app/rootStore';
import {
  PRELAUNCH_PREFERENCE_DISABLE,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_STATUS,
} from '@defi_types/ipcEvents';
import { handleGetPaymentRequest } from '../WalletPage/service';
import { IPCResponseModel } from '../../../../typings/common';
import { updateWalletMap } from '../../app/service';

export const getLanguage = () => {
  return [
    { label: 'containers.settings.english', value: ENGLISH },
    { label: 'containers.settings.german', value: GERMAN },
    { label: 'containers.settings.french', value: FRENCH },
    { label: 'containers.settings.chinese', value: CHINESE_SIMPLIFIED },
    {
      label: 'containers.settings.chinese_traditional',
      value: CHINESE_TRADITIONAL,
    },
    { label: 'containers.settings.dutch', value: DUTCH },
    { label: 'containers.settings.russian', value: RUSSIAN },
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

export const refreshUtxosAfterSavingData = async () => {
  const rpcClient = new RpcClient();
  store.dispatch(refreshUtxosRequest());
  const accounts = await fetchAccountsDataWithPagination(
    '',
    LIST_ACCOUNTS_PAGE_SIZE,
    rpcClient.listAccounts
  );

  const addressesList = accounts.map(async (account) => {
    return account.owner.addresses[0];
  });

  const resolvedData: any = compact(await Promise.all(addressesList));
  const result = handleGetPaymentRequest(getNetworkType());
  const receivedAddresses: any = result.map((addressObj) => addressObj.address);

  const finalData = [...resolvedData, ...receivedAddresses];

  const refrestUtxosAmounts = {};
  for (const address of finalData) {
    refrestUtxosAmounts[address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
  }

  const refreshUtxoTxId = await rpcClient.sendMany(refrestUtxosAmounts);
  store.dispatch(refreshUtxosSuccess());
  return refreshUtxoTxId;
};

const getPreLaunchStatus = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    const res = ipcRenderer.sendSync(PRELAUNCH_PREFERENCE_STATUS, {});
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
    const res = ipcRenderer.sendSync(PRELAUNCH_PREFERENCE_ENABLE, {
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
    const res = ipcRenderer.sendSync(PRELAUNCH_PREFERENCE_DISABLE, {});
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
    if (unit === FI) {
      PersistentStore.set(UNIT, DEFAULT_UNIT);
    }
    return DEFAULT_UNIT;
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

export const changePassphrase = async (
  currentPassphrase: string,
  newPassphrase: string
): Promise<IPCResponseModel<string>> => {
  try {
    const rpcClient = new RpcClient();
    const resp = await rpcClient.changeWalletPassphrase(
      currentPassphrase,
      newPassphrase
    );
    return {
      success: true,
      message: resp,
    };
  } catch (error) {
    log.error(getErrorMessage(error), 'changePassphrase');
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};

export const updateLockTimeout = async (
  lockTimeout: number
): Promise<IPCResponseModel<string>> => {
  try {
    updateWalletMap('', true, { lockTimeout });
    return {
      success: true,
    };
  } catch (error) {
    log.error(getErrorMessage(error), 'updateLockTimeout');
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
};
