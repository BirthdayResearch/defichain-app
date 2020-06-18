import React, { Component } from 'react';
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
import { TabContent } from 'reactstrap';
import SettingsTabGeneral from './components/SettingsTabGeneral';
import SettingsTabDisplay from './components/SettingsTabDisplay';

interface SettingsPageProps {
  isFetching: false;
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
    maximumAmount: number;
    maximumCount: number;
    feeRate: number;
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
  maximumAmount?: number;
  maximumCount?: number;
  feeRate?: number | string;
  isUnsavedChanges: boolean;
}

class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {
  constructor(props: Readonly<SettingsPageProps>) {
    super(props);
    this.state = {
      activeTab: 'general',
      ...props.appConfig,
      isUnsavedChanges: false,
    };
    props.getSettingOptionsRequest();
    props.getInitialSettingsRequest();
  }

  componentDidUpdate = (prevProps: { appConfig: any; isFetching: boolean }) => {
    if (!isEqual(this.props.appConfig, prevProps.appConfig)) {
      this.setState({
        ...this.props.appConfig,
        isUnsavedChanges: false,
      });
    }
  };

  setActiveTab = (tab: string) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  handleDropDowns = (data: any, field: any) => {
    this.setState(
      {
        [field]: data,
      } as SettingsPageState,
      () => this.checkForChanges()
    );
  };

  handleToggles = (field: string) => {
    this.setState(
      {
        [field]: !this.state[field],
      } as {
        pruneBlockStorage: boolean;
        minimizedAtLaunch: boolean;
        launchAtLogin: boolean;
      },
      () => this.checkForChanges()
    );
  };

  handleFractionalNumInputs = (
    event: { target: { name: string; value: string } },
    field: string
  ) => {
    if (isNaN(Number(event.target.value)) && event.target.value !== '') {
      return false;
    }

    this.setState(
      { [field]: event.target.value } as {
        feeRate: number | string;
      },
      () => this.checkForChanges()
    );
  };

  handleRegularNumInputs = (
    event: { target: { name: string; value: string } },
    field: string
  ) => {

    this.setState(
      {
        [field]: /^-?[0-9]+$/.test(event.target.value)
          ? parseInt(event.target.value, 10)
          : '',
      } as {
        scriptVerificationThreads: number;
        blockStorage: number;
        databaseCache: number;
        maximumAmount: number;
        maximumCount: number;
      },
      () => this.checkForChanges()
    );
  };

  checkForChanges = () => {
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
      'maximumAmount',
      'maximumCount',
      'feeRate',
    ];

    let isUnsavedChanges = false;

    keys.forEach(key => {
      if (!isUnsavedChanges && this.props.appConfig[key] !== this.state[key]) {
        isUnsavedChanges = true;
      }
    });

    const { launchAtLogin, minimizedAtLaunch } = this.state;

    this.setState({
      isUnsavedChanges,
      minimizedAtLaunch: !launchAtLogin ? false : minimizedAtLaunch,
    });
  };

  saveChanges = () => {
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
      maximumAmount,
      maximumCount,
      feeRate,
    } = this.state;

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
      maximumAmount,
      maximumCount,
      feeRate,
    };
    this.props.updateSettings(settings);
  };

  render() {
    const {
      activeTab,
      isUnsavedChanges,
      launchAtLogin,
      minimizedAtLaunch,
      pruneBlockStorage,
      blockStorage,
      databaseCache,
      maximumAmount,
      maximumCount,
      feeRate,
      scriptVerificationThreads,
      language,
      unit,
      displayMode,
    } = this.state;

    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>{I18n.t('containers.settings.title')}</title>
        </Helmet>
        <SettingsTabsHeader
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
        />
        <div className='content'>
          {/* NOTE: Do not remove, for future purpose */}
          {/* <SettingsTab
            launchAtLogin={launchAtLogin!}
            minimizedAtLaunch={minimizedAtLaunch!}
            language={language!}
            unit={unit!}
            displayMode={displayMode!}
            handleDropDowns={this.handleDropDowns}
            handleToggles={this.handleToggles}
          /> */}
          <TabContent activeTab={this.state.activeTab}>
            <SettingsTabGeneral
              launchAtLogin={launchAtLogin!}
              minimizedAtLaunch={minimizedAtLaunch!}
              pruneBlockStorage={pruneBlockStorage!}
              blockStorage={blockStorage!}
              databaseCache={databaseCache!}
              maximumAmount={maximumAmount!}
              maximumCount={maximumCount!}
              feeRate={feeRate!}
              scriptVerificationThreads={scriptVerificationThreads!}
              handleRegularNumInputs={this.handleRegularNumInputs}
              handleFractionalInputs={this.handleFractionalNumInputs}
              handleToggles={this.handleToggles}
            />
            <SettingsTabDisplay
              language={language!}
              unit={unit!}
              displayMode={displayMode!}
              handleDropDowns={this.handleDropDowns}
            />
          </TabContent>
        </div>
        <SettingsTabsFooter
          isUnsavedChanges={isUnsavedChanges}
          saveChanges={this.saveChanges}
        />
      </div>
    );
  }
}

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
