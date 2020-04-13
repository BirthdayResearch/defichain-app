import React from "react";
import { connect } from "react-redux";
import { SettingsTabDisplayProps } from "./SettingsPage.interface";
import { TabPane, Form } from "reactstrap";
import SettingsRowDropDown from "./SettingsRowDropDown";

const SettingsTabDisplay = (props: SettingsTabDisplayProps) => {
  const {
    languages,
    settingsLanguage,
    getLabel,
    amountUnits,
    settingsAmountsUnit,
    displayModes,
    settingDisplayMode,
    handleDropDowns,
  } = props;

  return (
    <TabPane tabId="display">
      <section>
        <Form>
          <SettingsRowDropDown
            label={"appLanguage"}
            data={languages}
            field={settingsLanguage}
            handleDropDowns={handleDropDowns}
            getLabel={getLabel}
            fieldName={"settingsLanguage"}
          />
          <SettingsRowDropDown
            label={"displayAmount"}
            data={amountUnits}
            field={settingsAmountsUnit}
            handleDropDowns={handleDropDowns}
            getLabel={getLabel}
            fieldName={"settingsAmountsUnit"}
          />
          <SettingsRowDropDown
            label={"displayMode"}
            data={displayModes}
            field={settingDisplayMode}
            handleDropDowns={handleDropDowns}
            getLabel={getLabel}
            fieldName={"settingDisplayMode"}
          />
        </Form>
      </section>
    </TabPane>
  );
};

const mapStateToProps = (state) => {
  const { languages, amountUnits, displayModes } = state.settings;

  return {
    languages,
    amountUnits,
    displayModes,
  };
};

export default connect(mapStateToProps)(SettingsTabDisplay);
