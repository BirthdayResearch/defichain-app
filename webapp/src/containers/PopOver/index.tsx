import React from 'react';
import ReIndexModel from './ReIndexModel';
import BackupWalletDatModal from './BackupWalletDatModal';
import UpdateProgressModal from './UpdateProgress';
import ResetWalletModal from './ResetWalletDatModal';

const PopOver = () => {
  return (
    <>
      <UpdateProgressModal />
      <ReIndexModel />
      <BackupWalletDatModal />
      <ResetWalletModal />
    </>
  );
};

export default PopOver;
