import React, { useEffect } from 'react';
import { MdDone } from 'react-icons/md';
import isEmpty from 'lodash/isEmpty';
import styles from './SyncStatus.module.scss';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { syncStatusRequest } from './reducer';
import { Progress } from 'reactstrap';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from '../WalletPage/reducer';
import UsePrevious from '../../components/UsePrevious';

interface SyncStatusProps {
  syncedPercentage: number;
  latestSyncedBlock: number;
  latestBlock: number;
  isLoading: boolean;
  syncStatusRequest: () => void;
  fetchWalletBalanceRequest: () => void;
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
    fetchWalletBalanceRequest,
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
      fetchWalletBalanceRequest();
      fetchPendingBalanceRequest();
    }
  }, [prevIsRestart, isRestart]);

  const chainName = !isEmpty(blockChainInfo)
    ? blockChainInfo.chain.charAt(0).toUpperCase() +
      blockChainInfo.chain.slice(1)
    : '';

  const syncBlock = () => {
    if (isLoading) {
      return <div>&nbsp;</div>;
    }
    return (
      <div>
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
    return <div />;
  };

  return (
    <div className={styles.syncStatusWrapper}>
      <div className={styles.syncHeading}>
        {I18n.t('components.syncStatus.network')}: {chainName}
      </div>
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
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncStatus);
