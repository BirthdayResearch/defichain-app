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
  EncryptWalletPageProps,
} from '../../WalletPage/components/EncryptWalletPage';

interface EncryptWalletModalProps extends EncryptWalletPageProps {
  isEncryptWalletModalOpen: boolean;
  closeEncryptWalletModal: () => void;
}

const EncryptWalletModal: React.FunctionComponent<EncryptWalletModalProps> = (
  props: EncryptWalletModalProps
) => {
  const { isEncryptWalletModalOpen, closeEncryptWalletModal } = props;

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
          onClose={closeEncryptWalletModal}
          isModal={true}
          pageSize={7}
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
