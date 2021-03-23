import React, { useState } from 'react';
import { TabPane, Row, Col, Form, FormGroup, Label, Button } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.scss';
import SettingsRowToggle from '../SettingsRowToggle';
import SettingsRowInput from '../SettingsRowInput';
import { connect } from 'react-redux';

import SettingsRowDropDown from '../SettingsRowDropDown';
import { openGeneralReIndexModal } from '../../../PopOver/reducer';
import { SettingsTabs } from '../SettingsTabHeader';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import styles from './SettingTabGeneral.module.scss';

interface SettingsTabGeneralProps {
  launchAtLogin: boolean;
  reindexAfterSaving: boolean;
  refreshUtxosAfterSaving: boolean;
  minimizedAtLaunch: boolean;
  pruneBlockStorage: boolean;
  deletePeersAndBlocks: boolean;
  blockStorage: number;
  databaseCache: number;
  maximumAmount: number;
  maximumCount: number;
  feeRate: number | string;
  scriptVerificationThreads: number;
  handleRegularNumInputs: any;
  handleFractionalInputs: any;
  handleToggles: any;
  network: string;
  networkOptions: { label: string; value: string }[];
  handleDropDowns: (data: any, field: any) => any;
  openGeneralReIndexModal: () => void;
  handeReindexToggle: () => void;
  handeRefreshUtxosToggle: () => void;
  sendCountdown: boolean;
  handeDeletePeersClick: () => void;
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
    networkOptions,
    network,
    reindexAfterSaving,
    deletePeersAndBlocks,
    refreshUtxosAfterSaving,
    handleDropDowns,
    openGeneralReIndexModal,
    handeReindexToggle,
    handeRefreshUtxosToggle,
    sendCountdown,
    handeDeletePeersClick,
  } = props;

  const [showAdvanceOption, setShowAdvanceOption] = useState(false);
  const [showWalletrepair, setShowWalletrepair] = useState(false);

  return (
    <TabPane tabId={SettingsTabs.general}>
      <section>
        <Form>
          <Row className='mb-5'>
            <Col md='12'>
              <SettingsRowDropDown
                label={'containers.settings.network'}
                data={networkOptions}
                field={network}
                handleDropDowns={handleDropDowns}
                fieldName={'network'}
              />
            </Col>
          </Row>
          <Row className='mb-5'>
            <Col md='4'>{I18n.t('containers.settings.launchOptions')}</Col>
            <Col md='8' lg='6'>
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
          <Row
            className={`md-5 ${styles.cursor}`}
            onClick={() => setShowAdvanceOption(!showAdvanceOption)}
          >
            {showAdvanceOption ? (
              <Col md='4'>
                <small className='text-muted'>
                  {I18n.t('containers.settings.hideAdvanceOptions')}
                  <MdArrowDropUp size={25} />
                </small>
              </Col>
            ) : (
              <Col md='4'>
                <small className='text-muted'>
                  {I18n.t('containers.settings.showAdvanceOptions')}
                  <MdArrowDropDown size={25} />
                </small>
              </Col>
            )}
          </Row>
          {showAdvanceOption && (
            <Row className='mb-5 mt-5'>
              <Col md='4'>{I18n.t('containers.settings.sendCountdown')}</Col>
              <Col md='8' lg='6'>
                <SettingsRowToggle
                  handleToggles={handleToggles}
                  label={'preventAccidental'}
                  field={sendCountdown}
                  fieldName={'sendCountdown'}
                />
              </Col>
              <Col md='4'>{I18n.t('containers.settings.utxoConsolidator')}</Col>
              <Col md='8' lg='6'>
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
          )}
          <Row
            className={`md-5 mt-6 ${styles.cursor}`}
            onClick={() => setShowWalletrepair(!showWalletrepair)}
          >
            {showWalletrepair ? (
              <Col md='4'>
                <small className='text-muted'>
                  {I18n.t('containers.settings.hidewalletHelper')}
                  <MdArrowDropUp size={25} />
                </small>
              </Col>
            ) : (
              <Col md='4'>
                <small className='text-muted'>
                  {I18n.t('containers.settings.ShowWalletRepair')}
                  <MdArrowDropDown size={25} />
                </small>
              </Col>
            )}
          </Row>
          {showWalletrepair && (
            <Row className='md-5 mt-5'>
              <Col md='4'>
                <Button
                  outline
                  color='primary'
                  size='sm'
                  className='mr-3'
                  onClick={handeRefreshUtxosToggle}
                >
                  {I18n.t('containers.settings.preFundTxns')}
                </Button>
              </Col>
              <Col md='8' lg='5'>
                {I18n.t('containers.settings.preFundTxnsDescription')}
              </Col>
              <Col md='4' className='mt-4'>
                <Button
                  outline
                  color='primary'
                  size='sm'
                  className='mr-3'
                  onClick={handeReindexToggle}
                >
                  {I18n.t('containers.settings.reindex')}
                </Button>
              </Col>
              <Col md='8' lg='6' className='mt-4'>
                {I18n.t('containers.settings.reindexDescription')}
              </Col>
              <Col md='4' className='mt-4'>
                <Button
                  outline
                  color='primary'
                  size='sm'
                  className='mr-3'
                  onClick={handeDeletePeersClick}
                >
                  {I18n.t('containers.settings.resetAndReindex')}
                </Button>
              </Col>
              <Col md='8' lg='6' className='mt-4'>
                {I18n.t('containers.settings.resetAndReindexInfo')}
              </Col>
            </Row>
          )}
          {/* <Row className='mb-5'>
            <Button
              color='primary'
              onClick={() => {
                console.log('click reindex button');
                openGeneralReIndexModal();
              }}
            >
              REINDEX
            </Button>
          </Row> */}
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

const mapStateToProps = (state) => {
  const { networkOptions } = state.settings;

  return {
    networkOptions,
  };
};

const mapDispatchToProps = {
  openGeneralReIndexModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsTabGeneral);
