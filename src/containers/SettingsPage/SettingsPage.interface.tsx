export interface SettingsPageProps {}
export interface SettingsPageState {
  activeTab: string;
  settingsPruneBlockStorage: boolean;
  settingsScriptVerificationThreads: number;
  languages: Array<{ label: string; value: string }>;
  amountUnits: Array<{ label: string; value: string }>;
  displayModes: Array<{ label: string; value: string }>;
  settingsLanguage: { label?: string; value?: string };
  settingsAmountsUnit: { label?: string; value?: string };
  settingDisplayMode: { label?: string; value?: string };
}
