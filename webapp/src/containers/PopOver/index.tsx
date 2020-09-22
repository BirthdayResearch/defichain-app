import React from 'react';
import ReIndexModel from './ReIndexModel';
import BackupWalletDatModal from './BackupWalletDatModal';
import UpdateProgressModal from './UpdateProgress';

const PopOver = () => {
  return (
    <>
      <UpdateProgressModal />
      <ReIndexModel />
      <BackupWalletDatModal />
    </>
  );
};

export default PopOver;
