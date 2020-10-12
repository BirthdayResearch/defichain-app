import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

import { closeBackupWalletWarningModal, backupWalletStart } from '../../PopOver/reducer';

interface BackupWalletWarningModelProps {
  isBackupWalletWarningModelOpen: boolean;
  closeBackupWalletWarningModal: () => void;
  backupWalletStart: () => void;
}

const BackupWalletWarningModel: React.FunctionComponent<BackupWalletWarningModelProps> = (
  props: BackupWalletWarningModelProps
) => {
  const {
    isBackupWalletWarningModelOpen,
    closeBackupWalletWarningModal,
    backupWalletStart
  } = props;

  return (
    <Modal isOpen={isBackupWalletWarningModelOpen} centered>
      <ModalBody>
        <h1 className='h4'>
          {I18n.t('alerts.backupWalletWarningModelHeader')}
        </h1>
        <label className='text-center'>
          {I18n.t('alerts.backupWalletWarning')}
        </label>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='primary'
          onClick={backupWalletStart}
        >
          {I18n.t('alerts.saveMyBackup')}
        </Button>
        <Button
          size='sm'
          className='ml-4'
          onClick={closeBackupWalletWarningModal}
        >
          {I18n.t('alerts.okIHaveDoneIt')}
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
  backupWalletStart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupWalletWarningModel);
