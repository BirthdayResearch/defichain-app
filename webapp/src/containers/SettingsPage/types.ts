const MINUTE = 60;
const HOUR = 60 * MINUTE;

export interface TimeoutLabel {
  label: string;
  value: any;
}

export enum TimeoutLockEnum {
  ONE_MINUTE = MINUTE,
  THREE_MINUTES = 3 * MINUTE,
  FIVE_MINUTES = 5 * MINUTE,
  TEN_MINUTES = 10 * MINUTE,
  ONE_HOUR = HOUR,
  MAX_TIME = 100000000,
}

export interface SettingsAppConfig {
  language: string;
  unit: string;
  displayMode: string;
  network: string;
  launchAtLogin: boolean;
  minimizedAtLaunch: boolean;
  pruneBlockStorage: boolean;
  scriptVerificationThreads: 0;
  blockStorage: string;
  databaseCache: string;
}

export interface SettingsState {
  isFetching: boolean;
  settingsError: string;
  appConfig: SettingsAppConfig;
  isUpdating: boolean;
  isUpdated: boolean;
  languages: [];
  amountUnits: [];
  displayModes: [];
  networkOptions: [];
  isRefreshUtxosModalOpen: boolean;
  isPassphraseChanging: boolean;
  changePassphraseError: string;
  lockTimeoutList: [];
  defaultLockTimeout: TimeoutLockEnum;
}
