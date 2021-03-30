import BigNumber from 'bignumber.js';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter, Progress } from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import styles from '../popOver.module.scss';
import { getPageTitle } from '../../../utils/utility';
import { Helmet } from 'react-helmet';
import { MdCamera } from 'react-icons/md';
import { DownloadSnapshotSteps } from '../types';
import { OFFICIAL_SNAPSHOT_URL, SNAPSHOT_BLOCK } from '@defi_types/snapshot';
import { openDownloadSnapshotModal, restartModal } from '../reducer';
import { disableReindex, restartNodeSync } from '../../../utils/isElectron';

const SnapshotDownloadModal: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const {
    isSnapshotDownloadOpen,
    snapshotDownloadData,
    snapshotDownloadSteps,
  } = useSelector((state: RootState) => state.popover);

  const getPercentage = (): string => {
    const completion =
      (snapshotDownloadSteps === DownloadSnapshotSteps.DownloadSnapshot
        ? snapshotDownloadData.completionRate
        : snapshotDownloadData.unpackModel?.completionRate) || 0;
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
        Downloading ${getPercentage()}% of snapshot from ${OFFICIAL_SNAPSHOT_URL}`;
        return title;
      case DownloadSnapshotSteps.SnapshotApplied:
        return I18n.t('alerts.startSyncBlock', { from: SNAPSHOT_BLOCK });
      case DownloadSnapshotSteps.ApplyingSnapshot:
        title = 'alerts.unpackingSnaphot';
        return I18n.t(title, { address: snapshotDownloadData.downloadPath });
      default:
        break;
    }
    return I18n.t(title);
  };

  const onApplyFinish = () => {
    disableReindex();
    dispatch(openDownloadSnapshotModal(false));
    dispatch(restartModal());
    restartNodeSync();
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
      <ModalBody style={{ padding: '4rem 6rem' }}>
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
        <ModalFooter>
          {snapshotDownloadSteps === DownloadSnapshotSteps.SnapshotRequest && (
            <Button color='primary'>
              {I18n.t('alerts.continueWithSnapshot')}
            </Button>
          )}
          {snapshotDownloadSteps === DownloadSnapshotSteps.SnapshotApplied && (
            <Button onClick={onApplyFinish} color='primary'>
              {I18n.t('alerts.closeBtnLabel')}
            </Button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
};

export default SnapshotDownloadModal;
