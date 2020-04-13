import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { TabContent } from "reactstrap";
import { I18n } from "react-redux-i18n";
import isEqual from "lodash/isEqual";
import { SettingsPageProps, SettingsPageState } from "./SettingsPage.interface";
import { getInitialSettingsRequest, updateSettingsRequest } from "./reducer";
import SettingsTabsHeader from "./SettingsTabsHeader";
import SettingsTabsFooter from "./SettingsTabsFooter";
import SettingsTabGeneral from "./SettingsTabGeneral";
import SettingsTabDisplay from "./SettingsTabDisplay";

class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {
  constructor(props: Readonly<SettingsPageProps>) {
    super(props);
    this.state = {
      activeTab: "general",
      ...props.settings,
      isUnsavedChanges: false,
    };
    props.loadSettings();
  }

  componentDidUpdate = (prevProps: { settings: any; isFetching: boolean }) => {
    if (!isEqual(this.props.settings, prevProps.settings)) {
      this.setState({
        ...this.props.settings,
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
        settingsPruneBlockStorage: boolean;
        settingsMinimizedAtLaunch: boolean;
        settingsLaunchAtLogin: boolean;
      },
      () => this.checkForChanges()
    );
  };

  handleInputs = (event: { target: { value: string } }, field: string) => {
    this.setState(
      {
        [field]: /^-?[0-9]+$/.test(event.target.value)
          ? parseInt(event.target.value)
          : "",
      } as {
        settingsScriptVerificationThreads: number;
        settingBlockStorage: number;
        settingsDatabaseCache: number;
      },
      () => this.checkForChanges()
    );
  };

  checkForChanges = () => {
    const keys = [
      "settingsLanguage",
      "settingsAmountsUnit",
      "settingDisplayMode",
      "settingsLaunchAtLogin",
      "settingsMinimizedAtLaunch",
      "settingsPruneBlockStorage",
      "settingsScriptVerificationThreads",
      "settingBlockStorage",
      "settingsDatabaseCache",
    ];

    let isUnsavedChanges = false;

    keys.forEach((key) => {
      if (!isUnsavedChanges && this.props.settings[key] !== this.state[key]) {
        isUnsavedChanges = true;
      }
    });

    const { settingsLaunchAtLogin, settingsMinimizedAtLaunch } = this.state;

    this.setState({
      isUnsavedChanges: isUnsavedChanges,
      settingsMinimizedAtLaunch: !settingsLaunchAtLogin
        ? false
        : settingsMinimizedAtLaunch,
    });
  };

  saveChanges = () => {
    const {
      settingsLanguage,
      settingsAmountsUnit,
      settingDisplayMode,
      settingsLaunchAtLogin,
      settingsMinimizedAtLaunch,
      settingsPruneBlockStorage,
      settingsScriptVerificationThreads,
      settingBlockStorage,
      settingsDatabaseCache,
    } = this.state;

    const settings = {
      settingsLanguage,
      settingsAmountsUnit,
      settingDisplayMode,
      settingsLaunchAtLogin,
      settingsMinimizedAtLaunch,
      settingsPruneBlockStorage,
      settingsScriptVerificationThreads,
      settingBlockStorage,
      settingsDatabaseCache,
    };
    this.props.updateSettings(settings);
  };

  getLabel = (list: any[], value: any) => {
    let index = list.findIndex((obj) => obj.value === value);

    if (index == -1) {
      return list[0].label;
    } else {
      return list[index].label;
    }
  };

  render() {
    const {
      activeTab,
      isUnsavedChanges,
      settingsLaunchAtLogin,
      settingsMinimizedAtLaunch,
      settingsPruneBlockStorage,
      settingBlockStorage,
      settingsDatabaseCache,
      settingsScriptVerificationThreads,
      settingsLanguage,
      settingsAmountsUnit,
      settingDisplayMode,
    } = this.state;

    return (
      <div className="main-wrapper">
        <Helmet>
          <title>{I18n.t("containers.settings.title")}</title>
        </Helmet>
        <SettingsTabsHeader
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
        />
        <div className="content">
          <TabContent activeTab={this.state.activeTab}>
            <SettingsTabGeneral
              settingsLaunchAtLogin={settingsLaunchAtLogin!}
              settingsMinimizedAtLaunch={settingsMinimizedAtLaunch!}
              settingsPruneBlockStorage={settingsPruneBlockStorage!}
              settingBlockStorage={settingBlockStorage!}
              settingsDatabaseCache={settingsDatabaseCache!}
              settingsScriptVerificationThreads={
                settingsScriptVerificationThreads!
              }
              handleInputs={this.handleInputs}
              handleToggles={this.handleToggles}
            />
            <SettingsTabDisplay
              settingsLanguage={settingsLanguage!}
              getLabel={this.getLabel}
              settingsAmountsUnit={settingsAmountsUnit!}
              settingDisplayMode={settingDisplayMode!}
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

const mapStateToProps = (state) => {
  const {
    isFetching,
    settingsError,
    settings,
    isUpdating,
    isUpdated,
  } = state.settings;
  const { locale } = state.i18n;
  return {
    isFetching,
    settingsError,
    settings,
    isUpdating,
    isUpdated,
    locale,
  };
};

const mapDispatchToProps = (
  dispatch: (arg0: {
    payload: { settings: any } | undefined;
    type: string;
  }) => any
) => {
  return {
    loadSettings: () => dispatch(getInitialSettingsRequest()),
    updateSettings: (settings) =>
      dispatch({ type: updateSettingsRequest.type, payload: { settings } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
