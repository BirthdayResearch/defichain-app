import React from 'react';
import { TabPane, Row, Col, Form, FormGroup, Label } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import SettingsRowToggle from '../SettingsRowToggle';
import SettingsRowInput from '../SettingsRowInput';

interface SettingsTabGeneralProps {
  launchAtLogin: boolean;
  minimizedAtLaunch: boolean;
  pruneBlockStorage: boolean;
  blockStorage: number;
  databaseCache: number;
  maximumAmount: number;
  maximumCount: number;
  feeRate: number | string;
  scriptVerificationThreads: number;
  handleRegularNumInputs: any;
  handleFractionalInputs: any
  handleToggles: any;
}

const SettingsTabGeneral = (props: SettingsTabGeneralProps) => {
  const {
    launchAtLogin,
    minimizedAtLaunch,
    pruneBlockStorage,
    blockStorage,
    databaseCache,
    maximumAmount,
    maximumCount,
    feeRate,
    scriptVerificationThreads,
    handleRegularNumInputs,
    handleFractionalInputs,
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
          <Row className='mb-5'>
            <Col md='4'>{I18n.t('containers.settings.utxoConsolidator')}</Col>
          </Row>
          <Row className='mb-5'>
            <Col md='8'>
              <FormGroup className='form-label-group mb-5'>
                <SettingsRowInput
                  field={maximumAmount}
                  fieldName={'maximumAmount'}
                  label={'maximumAmount'}
                  name={'maximumAmount'}
                  id={'maximumAmount'}
                  placeholder={'Number'}
                  handleInputs={handleRegularNumInputs}
                />
              </FormGroup>
              <FormGroup className='form-label-group mb-5'>
                <SettingsRowInput
                  field={maximumCount}
                  fieldName={'maximumCount'}
                  label={'maximumCount'}
                  name={'maximumCount'}
                  id={'maximumCount'}
                  placeholder={'Number'}
                  handleInputs={handleRegularNumInputs}
                />
              </FormGroup>
              <FormGroup className='form-label-group mb-5'>
                <SettingsRowInput
                  field={feeRate}
                  fieldName={'feeRate'}
                  label={'feeRate'}
                  name={'feeRate'}
                  id={'feeRate'}
                  placeholder={'Number'}
                  handleInputs={handleFractionalInputs}
                />
              </FormGroup>
            </Col>
          </Row>
          {/* NOTE: Do not remove, for future purpose */}
          {/* <Row className='mb-5'>
            <Col md='4'>{I18n.t('containers.settings.storage')}</Col>
            <Col md='8'>
              <SettingsRowToggle
                handleToggles={handleToggles}
                label={'pruneBlockStorage'}
                field={pruneBlockStorage}
                fieldName={'pruneBlockStorage'}
              />

              <FormGroup
                className={`form-label-group ${classnames({
                  'd-none': !pruneBlockStorage,
                })}`}
              >
                <SettingsRowInput
                  field={blockStorage}
                  fieldName={'blockStorage'}
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
                  field={databaseCache}
                  fieldName={'databaseCache'}
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
                        value={scriptVerificationThreads || 0}
                        onChange={event =>
                          handleInputs(event, 'scriptVerificationThreads')
                        }
                        min={-2}
                        max={16}
                        step={1}
                        tooltip='off'
                        id='scriptVerificationThreads'
                      />
                    </Col>
                    {scriptVerificationThreads === 0
                      ? 'Auto'
                      : scriptVerificationThreads}
                  </Row>
                </Col>
              </FormGroup>
            </Col>
          </Row> */}
        </Form>
      </section>
    </TabPane>
  );
};

export default SettingsTabGeneral;
