import React from 'react';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import styles from './ErrorLedgerModal.module.scss';

interface ErrorLedgerModalProps {
  isOpen: boolean;
  error: string;
  onAgainClick: () => void;
}

const ErrorLedgerModal: React.FC<ErrorLedgerModalProps> = ({
  isOpen,
  error,
  onAgainClick,
}: ErrorLedgerModalProps) => (
  <Modal isOpen={isOpen} centered>
    <ModalHeader className={styles['error-ledger-modal__header']}>
      <h2>Error</h2>
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
