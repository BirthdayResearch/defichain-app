export interface SettingsPageProps {
  isFetching: false;
  settingsError: string;
  languages: Array<{ label: string; value: string }>;
  amountUnits: Array<{ label: string; value: string }>;
  displayModes: Array<{ label: string; value: string }>;
  settings: {
    settingsLanguage: string;
    settingsAmountsUnit: string;
    settingDisplayMode: string;
    settingsLaunchAtLogin: boolean;
    settingsMinimizedAtLaunch: boolean;
    settingsPruneBlockStorage: boolean;
    settingsScriptVerificationThreads: number;
    settingBlockStorage: number;
    settingsDatabaseCache: number;
  };
  isUpdating: boolean;
  isUpdated: boolean;
  settingsLaunchAtLogin: boolean;
  settingsMinimizedAtLaunch: boolean;
  loadSettings: Function;
  updateSettings: Function;
  changeLanguage: Function;
}

export interface SettingsPageState {
  activeTab: string;
  settingsLanguage?: string;
  settingsAmountsUnit?: string;
  settingDisplayMode?: string;
  settingsLaunchAtLogin?: boolean;
  settingsMinimizedAtLaunch?: boolean;
  settingsPruneBlockStorage?: boolean;
  settingsScriptVerificationThreads?: number;
  settingBlockStorage?: number;
  settingsDatabaseCache?: number;
  isUnsavedChanges: boolean;
}

export interface SettingsTabsHeaderProps {
  setActiveTab: Function;
  activeTab: string;
}

export interface SettingsTabsFooterProps {
  saveChanges: Function;
  isUnsavedChanges: boolean;
}

export interface SettingsTabGeneralProps {
  settingsLaunchAtLogin: boolean;
  settingsMinimizedAtLaunch: boolean;
  settingsPruneBlockStorage: boolean;
  settingBlockStorage: number;
  settingsDatabaseCache: number;
  settingsScriptVerificationThreads: number;
  handleInputs: any;
  handleToggles: any;
}

export interface SettingsTabDisplayProps {
  languages: Array<{ label: string; value: string }>;
  settingsLanguage: string;
  getLabel: Function;
  amountUnits: Array<{ label: string; value: string }>;
  settingsAmountsUnit: string;
  displayModes: Array<{ label: string; value: string }>;
  settingDisplayMode: string;
  handleDropDowns: Function;
}
