import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

import {
  closeBackupWalletWarningModal,
  backupWalletStart,
  openWalletRestartModal,
} from '../../PopOver/reducer';

interface BackupWalletWarningModelProps {
  isBackupWalletWarningModelOpen: boolean;
  closeBackupWalletWarningModal: () => void;
  backupWalletStart: () => void;
  openWalletRestartModal: () => void;
}

const BackupWalletWarningModel: React.FunctionComponent<BackupWalletWarningModelProps> = (
  props: BackupWalletWarningModelProps
) => {
  const {
    isBackupWalletWarningModelOpen,
    closeBackupWalletWarningModal,
    backupWalletStart,
    openWalletRestartModal,
  } = props;

  return (
    <Modal isOpen={isBackupWalletWarningModelOpen} centered>
      <ModalBody>
        <h1 className='h4'>
          {I18n.t('alerts.backupWalletWarningModelHeader')}
        </h1>
        <p>{I18n.t('alerts.backupWalletWarning')}</p>
        <Button size='sm' color='link' onClick={backupWalletStart}>
          {I18n.t('alerts.backupNow')}
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='link'
          onClick={() => {
            closeBackupWalletWarningModal();
            openWalletRestartModal();
          }}
        >
          {I18n.t('alerts.skipBackup')}
        </Button>
        <Button size='sm' color='primary' onClick={backupWalletStart}>
          {I18n.t('alerts.saveMyBackup')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isBackupWalletWarningModelOpen } = state.popover;

  return {
    isBackupWalletWarningModelOpen,
  };
};

const mapDispatchToProps = {
  closeBackupWalletWarningModal,
  backupWalletStart,
  openWalletRestartModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupWalletWarningModel);
