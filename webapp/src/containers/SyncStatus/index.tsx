import React, { useEffect } from 'react';
import { MdDone } from 'react-icons/md';
import styles from './SyncStatus.module.scss';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { syncStatusRequest } from './reducer';
import { Progress } from 'reactstrap';
import {
  fetchInstantBalanceRequest,
  fetchPendingBalanceRequest,
} from '../WalletPage/reducer';
import UsePrevious from '../../components/UsePrevious';

interface SyncStatusProps {
  syncedPercentage: number;
  latestSyncedBlock: number;
  latestBlock: number;
  isLoading: boolean;
  syncStatusRequest: () => void;
  fetchInstantBalanceRequest: () => void;
  fetchPendingBalanceRequest: () => void;
  blockChainInfo: any;
  isRestart: boolean;
  isUpdateModalOpen: boolean;
  isUpdateStarted: boolean;
  updateAppInfo: any;
  isMinimized: boolean;
}

const SyncStatus: React.FunctionComponent<SyncStatusProps> = (
  props: SyncStatusProps
) => {
  const {
    isUpdateModalOpen,
    isUpdateStarted,
    updateAppInfo: { percent = 0 },
    syncStatusRequest,
    isRestart,
    fetchInstantBalanceRequest,
    fetchPendingBalanceRequest,
    isMinimized,
    latestSyncedBlock,
    latestBlock,
    syncedPercentage,
    isLoading,
    blockChainInfo,
  } = props;
  const prevIsRestart = UsePrevious(isRestart);

  useEffect(() => {
    syncStatusRequest();
  }, []);

  useEffect(() => {
    if (prevIsRestart && !isRestart) {
      syncStatusRequest();
      fetchInstantBalanceRequest();
      fetchPendingBalanceRequest();
    }
  }, [prevIsRestart, isRestart]);

  useEffect(() => {
    if (latestSyncedBlock >= latestBlock) {
      localStorage.setItem('lastSync', Date.now().toString());
    }
  }, [latestSyncedBlock, latestBlock]);

  const syncBlock = () => {
    if (isLoading) {
      return (
        <div className={styles.syncHeading}>
          {I18n.t(`components.syncStatus.waitingForSyncStatus`)}
        </div>
      );
    }
    return (
      <div>
        {latestSyncedBlock >= latestBlock ? (
          <>
            <div className={styles.syncHeading}>
              {I18n.t(`components.syncStatus.synchronized`)} <MdDone />
            </div>
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

  const updateInfo = () => {
    const percentValue = Number(percent).toFixed(2);

    if (!isUpdateModalOpen && isUpdateStarted && isMinimized) {
      return (
        <div className='mt-2'>
          <div className={styles.syncHeading}>
            {I18n.t('components.syncStatus.downloading')} {percentValue}%
          </div>
          <Progress
            animated
            className={styles.syncProgress}
            value={percentValue}
          />
        </div>
      );
    }

    const timeAgo = localStorage.getItem('lastSync');
    return (
      <div className={styles.blockStatus}>{/* Please add time ago here */}</div>
    );
  };

  return (
    <div className={styles.syncStatusWrapper}>
      {syncBlock()}
      {updateInfo()}
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    i18n: { locale },
    syncstatus: { syncedPercentage, latestSyncedBlock, latestBlock, isLoading },
    wallet: { blockChainInfo },
    popover: {
      isUpdateModalOpen,
      isUpdateStarted,
      updateAppInfo,
      isRestart,
      isMinimized,
    },
  } = state;
  return {
    locale,
    isLoading,
    latestBlock,
    syncedPercentage,
    latestSyncedBlock,
    blockChainInfo,
    isRestart,
    isUpdateModalOpen,
    isUpdateStarted,
    updateAppInfo,
    isMinimized,
  };
};

const mapDispatchToProps = {
  syncStatusRequest,
  fetchInstantBalanceRequest,
  fetchPendingBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncStatus);
