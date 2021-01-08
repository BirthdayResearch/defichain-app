import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { ModalBody, ModalFooter, Button, Modal } from 'reactstrap';
import { closeWalletDatBackupModal } from '../reducer';
import { backupWalletDat } from '../../../app/service';

import styles from '../popOver.module.scss';

interface BackupWalletNoticeProps {
  closeWalletDatBackupModal: () => void;
  openBackupWalletDatModal: boolean;
}

const BackupWalletNotice: React.FunctionComponent<BackupWalletNoticeProps> = (
  props: BackupWalletNoticeProps
) => {
  const { closeWalletDatBackupModal, openBackupWalletDatModal } = props;
  const closing = () => {
    closeWalletDatBackupModal();
  };
  return (
    <>
      <Modal
        isOpen={openBackupWalletDatModal}
        centered
        contentClassName={styles.onContentModal}
      >
        <ModalBody>
          <h1 className='h4'>{I18n.t('alerts.backupWalletNoticeTitle')}</h1>
          <p>{I18n.t('alerts.backupWalletDatNotice')}</p>
        </ModalBody>
        <ModalFooter>
          <Button size='sm' color='link' onClick={closing}>
            {I18n.t('alerts.noBackupWalletNotice')}
          </Button>
          <Button size='sm' color='primary' onClick={backupWalletDat}>
            {I18n.t('alerts.yesBackupWalletNotice')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
const mapStateToProps = ({ popover }) => ({
  openBackupWalletDatModal: popover.openBackupWalletDatModal,
});

const mapDispatchToProps = {
  closeWalletDatBackupModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(BackupWalletNotice);
