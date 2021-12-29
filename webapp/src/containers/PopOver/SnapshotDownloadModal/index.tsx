import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  Progress,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import styles from '../popOver.module.scss';
import { getPageTitle } from '../../../utils/utility';
import { Helmet } from 'react-helmet';
import { MdCamera, MdCheck } from 'react-icons/md';
import { DownloadSnapshotSteps } from '../types';
import {
  SNAPSHOT_PROVIDER,
  SNAPSHOT_EU,
  SNAPSHOT_ASIA,
  SNAPSHOT_US,
  SNAPSHOT_AU,
} from '@defi_types/snapshot';
import {
  openDownloadSnapshotModal,
  updateDownloadSnapshotData,
} from '../reducer';
import { disableReindex, restartApp } from '../../../utils/isElectron';
import { triggerNodeShutdown } from '../../../worker/queue';
import { replaceWalletMapSync, stopNode } from '../../../app/service';
import moment from 'moment';
import { onSnapshotDownloadRequest } from '../service';
import { onSnapshotDeleteRequest } from '../../../app/snapshot.ipcRenderer';

const SnapshotDownloadModal: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { walletMap } = useSelector((state: RootState) => state.wallet);

  const {
    isSnapshotDownloadOpen,
    snapshotDownloadData,
    snapshotDownloadSteps,
  } = useSelector((state: RootState) => state.popover);

  const snapshotLinks = [
    {
      label: 'Europe',
      value: SNAPSHOT_EU,
    },
    {
      label: 'Asia',
      value: SNAPSHOT_ASIA,
    },
    {
      label: 'US',
      value: SNAPSHOT_US,
    },
    {
      label: 'Australia',
      value: SNAPSHOT_AU,
    },
  ];

  const [snapshotURI, setSnapshotURI] = useState(snapshotLinks[0]);

  const getPercentage = (): string => {
    const completion = snapshotDownloadData.completionRate;
    return new BigNumber(completion).times(100).toFixed(2);
  };

  const getStepTitle = (step: DownloadSnapshotSteps): string => {
    let title = '';
    switch (step) {
      case DownloadSnapshotSteps.SnapshotRequest:
        title = 'alerts.snapshotSyncRecommended';
        break;
      case DownloadSnapshotSteps.DownloadSnapshot:
        title = 'alerts.downloadingSnapshot';
        break;
      case DownloadSnapshotSteps.SnapshotApplied:
        title = 'alerts.snapshotApplied';
        break;
      case DownloadSnapshotSteps.ApplyingSnapshot:
        title = 'alerts.applyingSnapshot';
        break;
      default:
        break;
    }
    return I18n.t(title);
  };

  const getStepDescription = (step: DownloadSnapshotSteps): string => {
    let title = '';
    switch (step) {
      case DownloadSnapshotSteps.SnapshotRequest:
        title = 'alerts.snapshotDescription';
        break;
      case DownloadSnapshotSteps.DownloadSnapshot:
        title = `
        Downloading ${getPercentage()}% of snapshot from ${
          snapshotDownloadData.downloadUrl
        }`;
        return title;
      case DownloadSnapshotSteps.SnapshotApplied:
        return I18n.t('alerts.startSyncBlock', {
          from: snapshotDownloadData.block,
        });
      case DownloadSnapshotSteps.ApplyingSnapshot:
        title = 'alerts.unpackingSnaphot';
        return I18n.t(title, { address: snapshotDownloadData.downloadPath });
      default:
        break;
    }
    return I18n.t(title);
  };

  const onApplyFinish = async (deleteSnapshot: boolean) => {
    if (deleteSnapshot) {
      onSnapshotDeleteRequest();
    }
    replaceWalletMapSync({
      ...walletMap,
      hasRescan: true,
    });
    disableReindex();
    dispatch(openDownloadSnapshotModal(false));
    await triggerNodeShutdown(false);
    await stopNode();
    restartApp();
  };

  const getSnapshotSize = (bytes: number): string => {
    return new BigNumber(bytes).dividedBy(1073741824).toFixed(2);
  };

  const onDownloadStart = () => {
    const downloadUrl = `${snapshotURI.value}${snapshotDownloadData.filename}`;
    dispatch(
      updateDownloadSnapshotData({
        ...snapshotDownloadData,
        downloadUrl,
      })
    );
    onSnapshotDownloadRequest(downloadUrl);
  };

  const closeModal = () => {
    dispatch(openDownloadSnapshotModal(false));
  };

  const barStyle = { borderRadius: '1rem' };

  return (
    <Modal
      isOpen={isSnapshotDownloadOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw', height: '100vh', margin: '0' }}
      centered
    >
      {DownloadSnapshotSteps.SnapshotRequest === snapshotDownloadSteps && (
        <Button
          color='link'
          onClick={closeModal}
          className={styles.floatingCancel}
        >
          {I18n.t('alerts.cancel')}
        </Button>
      )}
      <ModalBody style={{ padding: '3.5rem 6rem' }}>
        <div className='main-wrapper'>
          <>
            <Helmet>
              <title>{getPageTitle(I18n.t('alerts.snapshot'))}</title>
            </Helmet>
          </>
          <div className='content'>
            <section className='d-flex flex-column'>
              <div className='d-flex justify-content-center mb-3'>
                <MdCamera size={20} className={styles.iconBadge} />
              </div>
              <h2>{getStepTitle(snapshotDownloadSteps)}</h2>
              <div className={`${styles.syncHeading} mb-4`}>
                {getStepDescription(snapshotDownloadSteps)}
              </div>
              {/* Snapshot Request Body */}
              {DownloadSnapshotSteps.SnapshotRequest ===
                snapshotDownloadSteps && (
                <>
                  <section>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotDate')}</Col>
                      <Col md='8'>{`${moment(
                        snapshotDownloadData.snapshotDate
                      ).format('LLLL')} (${moment(
                        snapshotDownloadData.snapshotDate
                      ).fromNow()})`}</Col>
                    </Row>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotSize')}</Col>
                      <Col md='8'>{`${getSnapshotSize(
                        snapshotDownloadData.remoteSize
                      )} GB`}</Col>
                    </Row>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotProvider')}</Col>
                      <Col md='8'>{SNAPSHOT_PROVIDER}</Col>
                    </Row>
                    <Row className='mt-2'>
                      <Col className='d-flex align-items-center' md='4'>
                        {I18n.t('alerts.snapshotRegion')}
                      </Col>
                      <Col md='8'>
                        <UncontrolledDropdown>
                          <DropdownToggle caret color='outline-secondary'>
                            {snapshotURI.label}
                          </DropdownToggle>
                          <DropdownMenu>
                            {snapshotLinks.map((object) => {
                              return (
                                <DropdownItem
                                  className='d-flex justify-content-between'
                                  key={object.value}
                                  onClick={() => {
                                    setSnapshotURI(object);
                                  }}
                                  value={object.value}
                                >
                                  <span>{object.label}</span>
                                  &nbsp;
                                  {snapshotURI.value === object.value && (
                                    <MdCheck />
                                  )}
                                </DropdownItem>
                              );
                            })}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </section>
                  <section className={'mt-4'}>
                    <small className={styles.snapshotSubclaim}>
                      {I18n.t('alerts.afterDownload')}
                    </small>
                  </section>
                </>
              )}
              {/* Progress Bar */}
              {[
                DownloadSnapshotSteps.DownloadSnapshot,
                DownloadSnapshotSteps.ApplyingSnapshot,
              ].includes(snapshotDownloadSteps) && (
                <Progress
                  animated
                  striped={false}
                  className={styles.syncProgress}
                  value={getPercentage()}
                  style={barStyle}
                  barStyle={barStyle}
                />
              )}
            </section>
          </div>
        </div>
      </ModalBody>
      {[
        DownloadSnapshotSteps.SnapshotRequest,
        DownloadSnapshotSteps.SnapshotApplied,
      ].includes(snapshotDownloadSteps) && (
        <ModalFooter className='justify-content-center'>
          {snapshotDownloadSteps === DownloadSnapshotSteps.SnapshotRequest && (
            <Button
              onClick={onDownloadStart}
              color='primary'
              block
              className={styles.btnWidth}
            >
              {I18n.t('alerts.continueWithSnapshot')}
            </Button>
          )}
          {snapshotDownloadSteps === DownloadSnapshotSteps.SnapshotApplied && (
            <>
              <Button
                onClick={() => onApplyFinish(false)}
                color='link'
                block
                className={styles.btnWidth}
              >
                {I18n.t('alerts.yesRestartAppWithReindex')}
              </Button>
              <Button
                onClick={() => onApplyFinish(true)}
                color='primary'
                block
                className={styles.btnWidth}
              >
                {I18n.t('alerts.deleteSnapshotOnRestart')}
              </Button>
            </>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
};

export default SnapshotDownloadModal;
