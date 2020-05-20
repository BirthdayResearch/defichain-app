import React, { useEffect } from 'react';
import { MdDone } from 'react-icons/md';
import styles from './SyncStatus.module.scss';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { syncStatusRequest } from './reducer';
import { Progress } from 'reactstrap';

interface SyncStatusProps {
  syncedPercentage: number;
  latestSyncedBlock: number;
  latestBlock: number;
  isLoading: boolean;
  syncStatusRequest: () => void;
}

const SyncStatus: React.FunctionComponent<SyncStatusProps> = (
  props: SyncStatusProps
) => {
  useEffect(() => {
    props.syncStatusRequest();
  }, []);

  const { latestSyncedBlock, latestBlock, syncedPercentage, isLoading } = props;

  if (isLoading) {
    return <div className={styles.syncStatusWrapper}>&nbsp;</div>;
  }

  return (
    <div className={styles.syncStatusWrapper}>
      {latestSyncedBlock >= latestBlock ? (
        <>
          <span className={styles.syncHeading}>
            {I18n.t(`components.syncStatus.synchronized`)}
          </span>
          <MdDone />
        </>
      ) : (
        <>
          <div className={styles.syncHeading}>
            {I18n.t('components.syncStatus.syncing')} {syncedPercentage}%
          </div>
          <div className={styles.blockStatus}>
            {I18n.t('components.syncStatus.blockInfo', {
              latestSyncedBlock,
              latestBlock,
            })}
          </div>
          <Progress
            animated
            className={styles.syncProgress}
            value={syncedPercentage}
          />
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const { locale } = state.i18n;
  const {
    syncedPercentage,
    latestSyncedBlock,
    latestBlock,
    isLoading,
  } = state.syncstatus;
  return {
    locale,
    isLoading,
    latestBlock,
    syncedPercentage,
    latestSyncedBlock,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncStatusRequest: () => dispatch(syncStatusRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncStatus);
