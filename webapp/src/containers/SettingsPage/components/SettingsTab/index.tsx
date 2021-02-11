import React from 'react';
import { connect } from 'react-redux';
import { TabPane, Form, FormText, Row, Col } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import commaNumber from 'comma-number';
import SettingsRowDropDown from '../SettingsRowDropDown';
import { DFI_UNIT_MAP, DEFAULT_UNIT } from '../../../../constants';
import { getAmountInSelectedUnit } from '../../../../utils/utility';
import SettingsRowToggle from '../SettingsRowToggle';

interface SettingsTabProps {
  languages: { label: string; value: string }[];
  language: string;
  amountUnits: { label: string; value: string }[];
  unit: string;
  displayModes: { label: string; value: string }[];
  displayMode: string;
  handleDropDowns: (data: any, field: any) => any;
  launchAtLogin: boolean;
  minimizedAtLaunch: boolean;
  handleToggles: (field: string) => void;
}

const SettingsTab = (props: SettingsTabProps) => {
  const {
    languages,
    language,
    amountUnits,
    unit,
    displayModes,
    displayMode,
    launchAtLogin,
    handleDropDowns,
    handleToggles,
    minimizedAtLaunch,
  } = props;

  const getUnitDescription = () => {
    return Object.keys(DFI_UNIT_MAP).map((eachUnit) => {
      if (eachUnit === DEFAULT_UNIT) return null;
      const conversion = getAmountInSelectedUnit(1, eachUnit);
      return (
        <FormText key={eachUnit}>
          {I18n.t('containers.settings.conversionLabel', {
            to: eachUnit,
            from: DEFAULT_UNIT,
            conversion: commaNumber(conversion),
          })}
        </FormText>
      );
    });
  };

  return (
    <TabPane tabId='display'>
      <section>
        <Form>
          <Row className='mb-5'>
            <Col md='4'>{I18n.t('containers.settings.launchOptions')}</Col>
            <Col md='8'>
              <SettingsRowToggle
                handleToggles={handleToggles}
                label={'launchAtLogin'}
                field={launchAtLogin}
                fieldName={'launchAtLogin'}
              />
              <SettingsRowToggle
                handleToggles={handleToggles}
                label={'minimizedAtLaunch'}
                field={minimizedAtLaunch}
                fieldName={'minimizedAtLaunch'}
                hideMinimized={!launchAtLogin}
              />
            </Col>
          </Row>
          <SettingsRowDropDown
            label={'containers.settings.appLanguage'}
            data={languages}
            field={language}
            handleDropDowns={handleDropDowns}
            fieldName={'language'}
          />
          {/* <SettingsRowDropDown
            label={'containers.settings.displayAmount'}
            data={amountUnits}
            field={unit}
            handleDropDowns={handleDropDowns}
            fieldName={'unit'}
          >
            {getUnitDescription()}
          </SettingsRowDropDown> */}
          {/* <SettingsRowDropDown
            label={'containers.settings.displayMode'}
            data={displayModes}
            field={displayMode}
            handleDropDowns={handleDropDowns}
            fieldName={'displayMode'}
          /> */}
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

export default connect(mapStateToProps)(SettingsTab);
