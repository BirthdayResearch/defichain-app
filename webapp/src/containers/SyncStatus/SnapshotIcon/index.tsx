import React from 'react';
import { MdInfo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/rootTypes';
import { MAIN } from '../../../constants';
import { snapshotDownloadRequest } from '../service';
import styles from '../SyncStatus.module.scss';

export const SnapshotIcon: React.FunctionComponent = () => {
  const { activeNetwork } = useSelector((state: RootState) => state.app);
  return activeNetwork === MAIN ? (
    <MdInfo
      className={styles.snapshotIcon}
      onClick={snapshotDownloadRequest}
    ></MdInfo>
  ) : (
    <div></div>
  );
};

export default SnapshotIcon;
