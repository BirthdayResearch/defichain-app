import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';

import styles from '././walletPassphraseModal.module.scss';

import { closeWalletPassphraseModal } from '../reducer';
import WalletPassphrasePage from '../../WalletPage/components/WalletPassphrasePage';
import { unlockWalletStart } from '../../WalletPage/reducer';

interface WalletPassphraseModalProps {
  isWalletPassphraseModalOpen: boolean;
  closeWalletPassphraseModal: () => void;
  unlockWalletStart: (passphrase: string) => void;
}

const WalletPassphraseModal: React.FunctionComponent<WalletPassphraseModalProps> = (
  props: WalletPassphraseModalProps
) => {
  const { isWalletPassphraseModalOpen, closeWalletPassphraseModal } = props;
  return (
    <Modal
      isOpen={isWalletPassphraseModalOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw' }}
      centered
    >
      <ModalBody>
        <WalletPassphrasePage
          onClose={closeWalletPassphraseModal}
          isModal={true}
          pageSize={7}
        />
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isWalletPassphraseModalOpen } = state.popover;

  return {
    isWalletPassphraseModalOpen,
  };
};

const mapDispatchToProps = {
  closeWalletPassphraseModal,
  unlockWalletStart: (passphrase: string) => unlockWalletStart({ passphrase }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletPassphraseModal);
