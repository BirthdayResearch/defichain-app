import React from 'react';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { openPostEncryptBackupModal } from '../reducer';
import styles from '../popOver.module.scss';
import { startBackupWalletViaPostEncryptModal } from '../../WalletPage/reducer';

interface PostEncryptBackupModalProps {
  isPostEncryptBackupModalOpen: boolean;
  openPostEncryptBackupModal: (t: boolean) => void;
  startBackupWalletViaPostEncryptModal: () => void;
}

const PostEncryptBackupModal: React.FunctionComponent<PostEncryptBackupModalProps> = (
  props: PostEncryptBackupModalProps
) => {
  const {
    isPostEncryptBackupModalOpen,
    openPostEncryptBackupModal,
    startBackupWalletViaPostEncryptModal,
  } = props;
  return (
    <Modal
      className='text-center'
      isOpen={isPostEncryptBackupModalOpen}
      centered
    >
      <ModalBody className='p-5'>
        <MdSettingsBackupRestore
          className={`ml-2 ${styles.iconPointer} ${styles.iconBadge}`}
          size={20}
        />
        <p className='mb-0'>{I18n.t('alerts.walletBackupWarning')}</p>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='link'
          onClick={() => {
            openPostEncryptBackupModal(false);
          }}
        >
          {I18n.t('alerts.skipBackup')}
        </Button>
        <Button
          size='sm'
          color='primary'
          onClick={() => startBackupWalletViaPostEncryptModal()}
        >
          {I18n.t('alerts.backupNow')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isPostEncryptBackupModalOpen } = state.popover;

  return {
    isPostEncryptBackupModalOpen,
  };
};

const mapDispatchToProps = {
  openPostEncryptBackupModal,
  startBackupWalletViaPostEncryptModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostEncryptBackupModal);
