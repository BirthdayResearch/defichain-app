import React from 'react';
import { TabPane, Row, Col, Form, FormGroup, Label } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import SettingsRowToggle from '../SettingsRowToggle';
import SettingsRowInput from '../SettingsRowInput';

interface SettingsTabGeneralProps {
  settingsLaunchAtLogin: boolean;
  settingsMinimizedAtLaunch: boolean;
  settingsPruneBlockStorage: boolean;
  settingBlockStorage: number;
  settingsDatabaseCache: number;
  settingsScriptVerificationThreads: number;
  handleInputs: any;
  handleToggles: any;
}

const SettingsTabGeneral = (props: SettingsTabGeneralProps) => {
  const {
    settingsLaunchAtLogin,
    settingsMinimizedAtLaunch,
    settingsPruneBlockStorage,
    settingBlockStorage,
    settingsDatabaseCache,
    settingsScriptVerificationThreads,
    handleInputs,
    handleToggles,
  } = props;

  return (
    <TabPane tabId='general'>
      <section>
        <Form>
          <Row className='mb-5'>
            <Col md='4'>{I18n.t('containers.settings.launchOptions')}</Col>
            <Col md='8'>
              <SettingsRowToggle
                handleToggles={handleToggles}
                label={'launchAtLogin'}
                field={settingsLaunchAtLogin}
                fieldName={'settingsLaunchAtLogin'}
              />
              <SettingsRowToggle
                handleToggles={handleToggles}
                label={'minimizedAtLaunch'}
                field={settingsMinimizedAtLaunch}
                fieldName={'settingsMinimizedAtLaunch'}
                hideMinimized={!settingsLaunchAtLogin}
              />
            </Col>
          </Row>
          <Row className='mb-5'>
            <Col md='4'>{I18n.t('containers.settings.storage')}</Col>
            <Col md='8'>
              <SettingsRowToggle
                handleToggles={handleToggles}
                label={'pruneBlockStorage'}
                field={settingsPruneBlockStorage}
                fieldName={'settingsPruneBlockStorage'}
              />

              <FormGroup
                className={`form-label-group ${classnames({
                  'd-none': !settingsPruneBlockStorage,
                })}`}
              >
                <SettingsRowInput
                  field={settingBlockStorage}
                  fieldName={'settingBlockStorage'}
                  label={'blockPruneStorage'}
                  text={'gb'}
                  name={'pruneTo'}
                  id={'pruneTo'}
                  placeholder={'Number'}
                  handleInputs={handleInputs}
                />
              </FormGroup>
              <FormGroup className='form-label-group mb-5'>
                <SettingsRowInput
                  field={settingsDatabaseCache}
                  fieldName={'settingsDatabaseCache'}
                  label={'databaseSize'}
                  text={'mib'}
                  name={'dbCacheSize'}
                  id={'dbCacheSize'}
                  placeholder={'Number'}
                  handleInputs={handleInputs}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md='4'>{I18n.t('containers.settings.scriptVerification')}</Col>
            <Col md='8'>
              <FormGroup className='form-row'>
                <Col md='8'>
                  <Label for='scriptVerificationThreads'>
                    {I18n.t('containers.settings.noOfThreads')}
                  </Label>
                  <Row className='align-items-center'>
                    <Col className='col-auto'>
                      <RangeSlider
                        value={settingsScriptVerificationThreads || 0}
                        onChange={(event) =>
                          handleInputs(
                            event,
                            'settingsScriptVerificationThreads'
                          )
                        }
                        min={-2}
                        max={16}
                        step={1}
                        tooltip='off'
                        id='scriptVerificationThreads'
                      />
                    </Col>
                    {settingsScriptVerificationThreads === 0
                      ? 'Auto'
                      : settingsScriptVerificationThreads}
                  </Row>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </section>
    </TabPane>
  );
};

export default SettingsTabGeneral;
