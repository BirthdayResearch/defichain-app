import React, { useState } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalBody, ModalFooter, Button, Input } from 'reactstrap';
import {
  closeResetWalletDatModal,
  startResetWalletDatRequest,
} from '../reducer';
import styles from '../popOver.module.scss';
import { RESET_WALLET_CONFIRMATION_TEXT } from '../../../constants';

interface ResetWalletDatModalProps {
  openResetWalletDatModal: boolean;
  startResetWalletDatRequest: () => void;
  closeResetWalletDatModal: () => void;
}

const ResetWalletDatModal = (props: ResetWalletDatModalProps) => {
  const {
    openResetWalletDatModal,
    startResetWalletDatRequest,
    closeResetWalletDatModal,
  } = props;
  const [text, setText] = useState<string>('');
  return (
    <>
      <Modal
        isOpen={openResetWalletDatModal}
        centered
        contentClassName={styles.onContentModal}
      >
        <ModalBody>
          <h1 className='h4'>{I18n.t('alerts.resetWalletNoticeTitle')}</h1>
          <p>{I18n.t('alerts.resetWalletDatNotice')}</p>
          <Input
            placeholder={I18n.t('alerts.confirmResetWalletText', {
              text: RESET_WALLET_CONFIRMATION_TEXT,
            })}
            onChange={(e) => setText(e.target.value || '')}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size='sm'
            color='link'
            onClick={() => closeResetWalletDatModal()}
          >
            {I18n.t('alerts.cancel')}
          </Button>
          <Button
            size='sm'
            color='primary'
            disabled={!(text === RESET_WALLET_CONFIRMATION_TEXT)}
            onClick={() => startResetWalletDatRequest()}
          >
            {I18n.t('alerts.reset')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ popover }) => ({
  openResetWalletDatModal: popover.openResetWalletDatModal,
});

const mapDispatchToProps = {
  closeResetWalletDatModal,
  startResetWalletDatRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetWalletDatModal);
