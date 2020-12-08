import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import LedgerDownloadImg from '@/assets/img/ledgerDownload.png';
import LedgerConnectImg from '@/assets/img/ledgerConnect.png';
import styles from './HelpModal.module.scss';

interface HelpModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  toggle,
}: HelpModalProps) => (
  <Modal isOpen={isOpen} toggle={toggle} centered>
    <ModalHeader toggle={toggle} className={styles['help-modal__header']}>
      {`${I18n.t('containers.ledger.helpModal.title')}:`}
    </ModalHeader>
    <ModalBody className={styles['help-modal__body']}>
      <div className={styles['help-modal__item']}>
        <p>{`1. ${I18n.t('containers.ledger.helpModal.downloadItem')}`}</p>
        <img src={LedgerDownloadImg} alt='LedgerDownload' />
      </div>
      <div className={styles['help-modal__item']}>
        <p>{`2. ${I18n.t('containers.ledger.helpModal.plugItem')}`}</p>
        <img src={LedgerConnectImg} alt='LedgerConnect' />
      </div>
    </ModalBody>
  </Modal>
);

export default HelpModal;
