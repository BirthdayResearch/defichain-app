import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import LedgerDownloadImg from '@/assets/img/LedgerDownload.png';
import LedgerConnectImg from '@/assets/img/LedgerConnect.png';
import styles from './HelpModal.module.scss';

interface HelpModalProps {
  isOpen: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen }: HelpModalProps) => (
  <Modal isOpen={isOpen} centered>
    <ModalHeader className={styles['help-modal__header']}>
      How to connect Ledger to DeFi Wallet:
    </ModalHeader>
    <ModalBody className={styles['help-modal__body']}>
      <div className={styles['help-modal__item']}>
        <p>1. Download the Ledger App</p>
        <img src={LedgerDownloadImg} alt='LedgerDownload' />
      </div>
      <div className={styles['help-modal__item']}>
        <p>2. Plug and unlock your device </p>
        <img src={LedgerConnectImg} alt='LedgerConnect' />
      </div>
    </ModalBody>
  </Modal>
);

export default HelpModal;
