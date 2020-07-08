import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import isEqual from 'lodash/isEqual';
import {
  getInitialSettingsRequest,
  updateSettingsRequest,
  getSettingOptionsRequest,
} from './reducer';
import SettingsTabsHeader from './components/SettingsTabHeader';
import SettingsTabsFooter from './components/SettingsTabFooter';
import SettingsTab from './components/SettingsTab';
import usePrevious from '../../components/UsePrevious';
// NOTE: Do not remove, for future purpose
// import { TabContent } from 'reactstrap';
// import SettingsTabGeneral from './components/SettingsTabGeneral';
// import SettingsTabDisplay from './components/SettingsTabDisplay';

interface SettingsPageProps {
  isFetching: boolean;
  settingsError: string;
  languages: { label: string; value: string }[];
  amountUnits: { label: string; value: string }[];
  displayModes: { label: string; value: string }[];
  appConfig: {
    language: string;
    unit: string;
    displayMode: string;
    launchAtLogin: boolean;
    minimizedAtLaunch: boolean;
    pruneBlockStorage: boolean;
    scriptVerificationThreads: number;
    blockStorage: number;
    databaseCache: number;
  };
  isUpdating: boolean;
  isUpdated: boolean;
  launchAtLogin: boolean;
  minimizedAtLaunch: boolean;
  getInitialSettingsRequest: () => void;
  getSettingOptionsRequest: () => void;
  updateSettings: (data: any) => void;
  changeLanguage: () => void;
}

interface SettingsPageState {
  activeTab: string;
  language?: string;
  unit?: string;
  displayMode?: string;
  launchAtLogin?: boolean;
  minimizedAtLaunch?: boolean;
  pruneBlockStorage?: boolean;
  scriptVerificationThreads?: number;
  blockStorage?: number;
  databaseCache?: number;
  isUnsavedChanges: boolean;
}

const SettingsPage: React.FunctionComponent<SettingsPageProps> = (
  props: SettingsPageProps
) => {
  const [state, setState] = useState<SettingsPageState>({
    activeTab: 'general',
    ...props.appConfig,
    isUnsavedChanges: false,
  });

  useEffect(() => {
    props.getSettingOptionsRequest();
    props.getInitialSettingsRequest();
  }, []);
  const prevProps: any = usePrevious(props);
  const prevState: any = usePrevious(state) || {};
  const setSettingsPageState = (updatedObject: any) => {
    const updatedState = Object.assign({}, state, updatedObject);
    setState(updatedState);
  };

  useEffect(() => {
    const prevPropsValue =
      !!prevProps && !!prevProps.appConfig ? prevProps.appConfig : {};
    if (!isEqual(props.appConfig, prevPropsValue)) {
      setSettingsPageState({
        ...props.appConfig,
        isUnsavedChanges: false,
      });
    }
  }, [props, prevProps]);

  useEffect(() => {
    if (!isEqual(prevState, state)) {
      checkForChanges();
    }
  }, [prevState, state]);

  const setActiveTab = (tab: string) => {
    if (state.activeTab !== tab) {
      setSettingsPageState({
        activeTab: tab,
      });
    }
  };

  const handleDropDowns = (data: any, field: any) => {
    setSettingsPageState({
      [field]: data,
    });
  };

  const handleToggles = (field: string) => {
    setSettingsPageState({
      [field]: !state[field],
    });
  };

  const handleInputs = (
    event: { target: { value: string } },
    field: string
  ) => {
    setSettingsPageState({
      [field]: /^-?[0-9]+$/.test(event.target.value)
        ? parseInt(event.target.value, 10)
        : '',
    });
  };

  const checkForChanges = () => {
    const keys = [
      'language',
      'unit',
      'displayMode',
      'launchAtLogin',
      'minimizedAtLaunch',
      'pruneBlockStorage',
      'scriptVerificationThreads',
      'blockStorage',
      'databaseCache',
    ];

    let isUnsavedChanges = false;

    keys.forEach(key => {
      if (!isUnsavedChanges && props.appConfig[key] !== state[key]) {
        isUnsavedChanges = true;
      }
    });

    const { launchAtLogin, minimizedAtLaunch } = state;

    setSettingsPageState({
      isUnsavedChanges,
      minimizedAtLaunch: !launchAtLogin ? false : minimizedAtLaunch,
    });
  };

  const saveChanges = () => {
    const {
      language,
      unit,
      displayMode,
      launchAtLogin,
      minimizedAtLaunch,
      pruneBlockStorage,
      scriptVerificationThreads,
      blockStorage,
      databaseCache,
    } = state;

    const settings = {
      language,
      unit,
      displayMode,
      launchAtLogin,
      minimizedAtLaunch,
      pruneBlockStorage,
      scriptVerificationThreads,
      blockStorage,
      databaseCache,
    };
    props.updateSettings(settings);
  };
  const {
    activeTab,
    isUnsavedChanges,
    launchAtLogin,
    minimizedAtLaunch,
    pruneBlockStorage,
    blockStorage,
    databaseCache,
    scriptVerificationThreads,
    language,
    unit,
    displayMode,
  } = state;

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.settings.title')}</title>
      </Helmet>
      <SettingsTabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='content'>
        <SettingsTab
          launchAtLogin={launchAtLogin!}
          minimizedAtLaunch={minimizedAtLaunch!}
          language={language!}
          unit={unit!}
          displayMode={displayMode!}
          handleDropDowns={handleDropDowns}
          handleToggles={handleToggles}
        />
        {/* NOTE: Do not remove, for future purpose */}
        {/* <TabContent activeTab={state.activeTab}>
          <SettingsTabGeneral
            launchAtLogin={launchAtLogin!}
            minimizedAtLaunch={minimizedAtLaunch!}
            pruneBlockStorage={pruneBlockStorage!}
            blockStorage={blockStorage!}
            databaseCache={databaseCache!}
            scriptVerificationThreads={scriptVerificationThreads!}
            handleInputs={handleInputs}
            handleToggles={handleToggles}
          />
          <SettingsTabDisplay
            language={language!}
            unit={unit!}
            displayMode={displayMode!}
            handleDropDowns={handleDropDowns}
          />
        </TabContent>
       */}
      </div>
      <SettingsTabsFooter
        isUnsavedChanges={isUnsavedChanges}
        saveChanges={saveChanges}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const {
    isFetching,
    settingsError,
    appConfig,
    isUpdating,
    isUpdated,
  } = state.settings;
  const { locale } = state.i18n;
  return {
    isFetching,
    settingsError,
    appConfig,
    isUpdating,
    isUpdated,
    locale,
  };
};

const mapDispatchToProps = {
  getSettingOptionsRequest,
  getInitialSettingsRequest,
  updateSettings: settings => updateSettingsRequest(settings),
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
