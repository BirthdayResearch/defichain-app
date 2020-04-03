export interface SettingsPageProps {}
export interface SettingsPageState {
  activeTab: string;
  settingsPruneBlockStorage: boolean;
  settingsScriptVerificationThreads: number;
  settingsLanguage: string;
  settingsAmountsUnit: string;
  languages: Array<
    | { english: string; german?: undefined }
    | { german: string; english?: undefined }
  >;
  displayMode: string;
}
