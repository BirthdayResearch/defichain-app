import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import styles from './NotFoundLedgerModal.module.scss';

interface NotFoundLedgerModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const NotFoundLedgerModal: React.FC<NotFoundLedgerModalProps> = ({
  isOpen, toggle,
}: NotFoundLedgerModalProps) => {
  const [isHelp, setIsHelp] = useState(false);
  useEffect(() => {
    let timeoutId: null | NodeJS.Timeout = null;
    if (isOpen) {
      timeoutId = setTimeout(() => {
        setIsHelp(true);
      }, 30000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setIsHelp(false);
      }
    }
  }, [setIsHelp, isOpen]);
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered unmountOnClose>
      {isHelp ? (
        <>
          <ModalHeader toggle={toggle} className={styles['not-found-ledger-modal__header']}>
            Having a hard time connecting your device?
          </ModalHeader>
          <ModalBody className={styles['not-found-ledger-modal__help-body']}>
            <a>Help</a>
          </ModalBody>
        </>
      ) : (
        <>
          <ModalHeader tag='h2' className={styles['not-found-ledger-modal__header']} toggle={toggle}>
            Error
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
