import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import styles from './EncryptWalletModal.module.scss';

import {
  closeEncryptWalletModal,
  encryptWalletFailure,
  encryptWalletStart,
} from '../reducer';
import EncryptWalletPage, {
  EncryptWalletPayload,
} from '../../WalletPage/components/EncryptWalletPage';

interface EncryptWalletModalProps {
  isWalletEncrypting: boolean;
  isEncryptWalletModalOpen: boolean;
  isErrorEncryptingWallet: string;
  encryptWalletFailure: (err: string) => void;
  encryptWalletStart: (item: EncryptWalletPayload) => void;
  closeEncryptWalletModal: () => void;
}

const EncryptWalletModal: React.FunctionComponent<EncryptWalletModalProps> = (
  props: EncryptWalletModalProps
) => {
  const {
    isEncryptWalletModalOpen,
    closeEncryptWalletModal,
    encryptWalletStart,
    isWalletEncrypting,
    isErrorEncryptingWallet,
    encryptWalletFailure,
  } = props;

  return (
    <Modal
      isOpen={isEncryptWalletModalOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw' }}
      centered
    >
      <ModalBody>
        <EncryptWalletPage
          submitButtonLabel={'alerts.enableLocking'}
          onCloseFailure={encryptWalletFailure}
          pageErrorMessage={isErrorEncryptingWallet}
          pageLoadingMessage={
            'containers.wallet.encryptWalletPage.encryptingWallet'
          }
          isPageLoading={isWalletEncrypting}
          onSave={encryptWalletStart}
          onClose={closeEncryptWalletModal}
          isModal={true}
          pageSize={8}
        />
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const {
    isEncryptWalletModalOpen,
    isWalletEncrypting,
    isErrorEncryptingWallet,
  } = state.popover;
  return {
    isWalletEncrypting,
    isEncryptWalletModalOpen,
    isErrorEncryptingWallet,
  };
};

const mapDispatchToProps = {
  encryptWalletStart,
  encryptWalletFailure,
  closeEncryptWalletModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(EncryptWalletModal);
