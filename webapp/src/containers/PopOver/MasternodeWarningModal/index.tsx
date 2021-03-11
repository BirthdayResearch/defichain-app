import React from 'react';
import { MdLock } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import { lockWalletStart } from '../../WalletPage/reducer';
import styles from '../popOver.module.scss';
import { openMasternodeWarningModal } from '../reducer';

const MasternodeWarningModal: React.FunctionComponent = () => {
  const {
    popover: { isMasternodeWarningModalOpen },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  return (
    <Modal isOpen={isMasternodeWarningModalOpen} centered>
      <ModalBody className='p-5 text-center'>
        <MdLock
          className={`ml-2 ${styles.iconPointer} ${styles.iconBadge}`}
          size={20}
        />
        <p className='mb-0'>{I18n.t('alerts.masternodesAlert')}</p>
      </ModalBody>
      <ModalFooter>
        <Button
          size='sm'
          color='link'
          onClick={() => dispatch(openMasternodeWarningModal(false))}
        >
          {I18n.t('alerts.cancel')}
        </Button>
        <Button
          size='sm'
          color='primary'
          onClick={() => {
            dispatch(openMasternodeWarningModal(false));
            dispatch(lockWalletStart());
          }}
        >
          {I18n.t('alerts.encryptWalletNoticeTitle')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MasternodeWarningModal;
