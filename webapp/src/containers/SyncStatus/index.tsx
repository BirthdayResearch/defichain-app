import React, { useEffect } from 'react';
import { MdDone } from 'react-icons/md';
import isEmpty from 'lodash/isEmpty';
import styles from './SyncStatus.module.scss';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { syncStatusRequest } from './reducer';
import { Progress } from 'reactstrap';
import UsePrevious from '../../components/UsePrevious';

interface SyncStatusProps {
  syncedPercentage: number;
  latestSyncedBlock: number;
  latestBlock: number;
  isLoading: boolean;
  syncStatusRequest: () => void;
  blockChainInfo: any;
  isRestart: boolean;
}

const SyncStatus: React.FunctionComponent<SyncStatusProps> = (
  props: SyncStatusProps
) => {
  const prevIsRestart = UsePrevious(props.isRestart);
  useEffect(() => {
    props.syncStatusRequest();
  }, []);
  useEffect(() => {
    if (prevIsRestart && !props.isRestart) {
      props.syncStatusRequest();
    }
  }, [prevIsRestart && !props.isRestart]);

  const {
    latestSyncedBlock,
    latestBlock,
    syncedPercentage,
    isLoading,
    blockChainInfo,
  } = props;
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

  return (
    <div className={styles.syncStatusWrapper}>
      <div className={styles.syncHeading}>
        {I18n.t('components.syncStatus.network')}: {chainName}
      </div>
      {syncBlock()}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { locale } = state.i18n;
  const {
    syncedPercentage,
    latestSyncedBlock,
    latestBlock,
    isLoading,
    blockChainInfo,
  } = state.syncstatus;
  const { isRestart } = state.errorModal;
  return {
    locale,
    isLoading,
    latestBlock,
    syncedPercentage,
    latestSyncedBlock,
    blockChainInfo,
    isRestart,
  };
};

const mapDispatchToProps = {
  syncStatusRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncStatus);
