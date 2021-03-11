import React from 'react';
import { MdExitToApp } from 'react-icons/md';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { openExitWalletModal, startResetWalletDatRequest } from '../reducer';
import styles from '../popOver.module.scss';
import { startBackupWalletViaExitModal } from '../../WalletPage/reducer';

interface ExitWalletModalProps {
  isExitWalletOpen: boolean;
  openExitWalletModal: (t: boolean) => void;
  startResetWalletDatRequest: () => void;
  startBackupWalletViaExitModal: () => void;
}

const ExitWalletModal: React.FunctionComponent<ExitWalletModalProps> = (
  props: ExitWalletModalProps
) => {
  const {
    isExitWalletOpen,
    openExitWalletModal,
    startResetWalletDatRequest,
    startBackupWalletViaExitModal,
  } = props;
  return (
    <Modal className='text-center' isOpen={isExitWalletOpen} centered>
      <ModalBody className='p-5'>
        <MdExitToApp
          className={`ml-2 ${styles.iconPointer} ${styles.flipX} ${styles.iconBadge}`}
          size={20}
        />
        <p className='mb-0'>{I18n.t('alerts.exitBackupWarning')}</p>
      </ModalBody>
      <ModalFooter>
        <Button
          className={'mr-auto'}
          size='sm'
          color='link'
          onClick={() => openExitWalletModal(false)}
        >
          {I18n.t('alerts.cancel')}
        </Button>
        <Button
          size='sm'
          color='link'
          onClick={() => {
            openExitWalletModal(false);
            startResetWalletDatRequest();
          }}
        >
          {I18n.t('alerts.exit')}
        </Button>
        <Button
          size='sm'
          color='primary'
          onClick={() => startBackupWalletViaExitModal()}
        >
          {I18n.t('alerts.backupAndExit')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isExitWalletOpen } = state.popover;

  return {
    isExitWalletOpen,
  };
};

const mapDispatchToProps = {
  openExitWalletModal,
  startResetWalletDatRequest,
  startBackupWalletViaExitModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExitWalletModal);
