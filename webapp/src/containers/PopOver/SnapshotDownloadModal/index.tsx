import BigNumber from 'bignumber.js';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalBody, Progress } from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import styles from '../popOver.module.scss';
import syncStatusStyles from '../../SyncStatus/SyncStatus.module.scss';
import { getPageTitle } from '../../../utils/utility';
import { Helmet } from 'react-helmet';
import { MdCamera } from 'react-icons/md';
import { DownloadSnapshotSteps } from '../types';

const SnapshotDownloadModal: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const {
    isSnapshotDownloadOpen,
    snapshotDownloadData,
    snapshotDownloadSteps,
  } = useSelector((state: RootState) => state.popover);

  const percentage = new BigNumber(snapshotDownloadData.completionRate)
    .times(100)
    .toFixed(2);

  const getStepTitle = (step: DownloadSnapshotSteps): string => {
    let title = '';
    switch (step) {
      case DownloadSnapshotSteps.SnapshotRequest:
        title = 'alerts.snapshotSyncRecommended';
        break;
      case DownloadSnapshotSteps.DownloadSnapshot:
        title = 'alerts.downloadingSnapshot';
      case DownloadSnapshotSteps.SnapshotApplied:
        title = 'alerts.applied';
      case DownloadSnapshotSteps.ApplyingSnapshot:
        title = 'alerts.applyingSnapshot';
      default:
        break;
    }
    return I18n.t(title);
  };

  return (
    <Modal
      isOpen={isSnapshotDownloadOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw', height: '100vh', margin: '0' }}
      centered
    >
      <ModalBody>
        <div className='main-wrapper'>
          <>
            <Helmet>
              <title>{getPageTitle(I18n.t('alerts.snapshot'))}</title>
            </Helmet>
          </>
          <div className='content'>
            <section>
              <MdCamera size={20} className={styles.iconBadge} />
              <h4>{getStepTitle(snapshotDownloadSteps)}</h4>
              <div className={syncStatusStyles.syncHeading}>
                {I18n.t('components.syncStatus.downloading')} {percentage}%
              </div>
              <Progress
                animated
                className={syncStatusStyles.syncProgress}
                value={percentage}
              />
            </section>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SnapshotDownloadModal;
