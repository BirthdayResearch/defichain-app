import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import styles from './NotFoundLedgerModal.module.scss';

interface NotFoundLedgerModalProps {
  isOpen: boolean;
}

const NotFoundLedgerModal: React.FC<NotFoundLedgerModalProps> = ({
  isOpen,
}: NotFoundLedgerModalProps) => {
  const [isHelp, setIsHelp] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsHelp(true);
    }, 30000);
    return () => clearTimeout(timeoutId);
  }, [setIsHelp]);
  return (
    <Modal isOpen={isOpen} centered>
      {isHelp ? (
        <ModalBody className={styles['not-found-ledger-modal__help-body']}>
          <p>Having a hard time connecting your device?</p>
          <a>Help</a>
        </ModalBody>
      ) : (
        <>
          <ModalHeader className={styles['not-found-ledger-modal__header']}>
            <h2>Error</h2>
          </ModalHeader>
          <ModalBody className={styles['not-found-ledger-modal__body']}>
            <div className={styles['not-found-ledger-modal__subheader']}>
              <p className={styles['not-found-ledger-modal__item']}>
                The Ledger is not found
              </p>
              <p>Follow the instructions</p>
            </div>
            <div className={styles['not-found-ledger-modal__content']}>
              <p>1. Install the app on Ledger Live</p>
              <p>2. Plug your device into computer</p>
              <p>3. Unlock your device</p>
              <p>4. Press buttons on your device</p>
            </div>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default NotFoundLedgerModal;
