import React from 'react';
import { MdRestorePage } from 'react-icons/md';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { shortenedPathAddress } from '../../../utils/utility';

import { openRestoreWalletModal } from '../../PopOver/reducer';
import styles from '../popOver.module.scss';
import { startRestoreWalletViaRecent } from '../../WalletPage/reducer';

interface RestoreWalletModalProps {
  isRestoreWalletOpen: boolean;
  openRestoreWalletModal: (isOpen: boolean, filePath?: string) => void;
  startRestoreWalletViaRecent: (filePath: string) => void;
  filePath: string;
}

const RestoreWalletModal: React.FunctionComponent<RestoreWalletModalProps> = (
  props: RestoreWalletModalProps
) => {
  const {
    isRestoreWalletOpen,
    openRestoreWalletModal,
    filePath,
    startRestoreWalletViaRecent,
  } = props;
  return (
    <Modal className='text-center' isOpen={isRestoreWalletOpen} centered>
      <ModalBody className='p-5'>
        <MdRestorePage size={20} className={styles.iconBadge} />
        <p className='mb-0'>{I18n.t('alerts.restoreYourWallet')}</p>
        <h6 className='mb-0'>{shortenedPathAddress(filePath)}</h6>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='link'
          onClick={() => openRestoreWalletModal(false)}
        >
          {I18n.t('alerts.cancel')}
        </Button>
        <Button
          size='sm'
          color='primary'
          onClick={() => startRestoreWalletViaRecent(filePath)}
        >
          {I18n.t('containers.wallet.restoreWalletPage.restore')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isRestoreWalletOpen, filePath } = state.popover;

  return {
    isRestoreWalletOpen,
    filePath,
  };
};

const mapDispatchToProps = {
  openRestoreWalletModal,
  startRestoreWalletViaRecent,
};

export default connect(mapStateToProps, mapDispatchToProps)(RestoreWalletModal);
