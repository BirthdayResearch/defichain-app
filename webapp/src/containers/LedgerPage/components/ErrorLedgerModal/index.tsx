import React from 'react';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import styles from './ErrorLedgerModal.module.scss';

interface ErrorLedgerModalProps {
  isOpen: boolean;
  error: string;
  onAgainClick: () => void;
  toggle: () => void;
}

const ErrorLedgerModal: React.FC<ErrorLedgerModalProps> = ({
  isOpen,
  error,
  onAgainClick,
                                                             toggle,
}: ErrorLedgerModalProps) => (
  <Modal isOpen={isOpen} centered toggle={toggle}>
    <ModalHeader tag='h2' className={styles['error-ledger-modal__header']} toggle={toggle}>
      Error
    </ModalHeader>
    <ModalBody className={styles['error-ledger-modal__body']}>
      <p>{error}</p>
      <Button color='link' size='sm' onClick={onAgainClick}>
        Try again
      </Button>
    </ModalBody>
  </Modal>
);

export default ErrorLedgerModal;
