export enum TimeoutLockEnum {
  ONE_MINUTE = 60,
  THREE_MINUTES = 180,
  FIVE_MINUTES = 300,
  TEN_MINUTES = 600,
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
