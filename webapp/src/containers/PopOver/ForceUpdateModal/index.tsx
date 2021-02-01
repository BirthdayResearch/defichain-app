import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

import {
  closeWalletRestartModal,
  restartWalletStart,
} from '../../PopOver/reducer';

interface ForceUpdateModalProps {
  isWalletRestart: boolean;
  closeWalletRestartModal: () => void;
  restartWalletStart: () => void;
}

const ForceUpdateModal: React.FunctionComponent<ForceUpdateModalProps> = (
  props: ForceUpdateModalProps
) => {
  const {
    isWalletRestart,
    closeWalletRestartModal,
    restartWalletStart,
  } = props;
  return (
    <Modal isOpen={isWalletRestart} centered>
      <ModalBody>
        <h1 className='h4'>{I18n.t('alerts.restartWalletModalHeader')}</h1>
        <p>{I18n.t('alerts.restartWalletWarningNotice')}</p>
      </ModalBody>
      <ModalFooter>
        <Button size='sm' color='link' onClick={closeWalletRestartModal}>
          {I18n.t('alerts.noRestartWalletNotice')}
        </Button>
        <Button size='sm' color='primary' onClick={restartWalletStart}>
          {I18n.t('alerts.yesRestartWalletNotice')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isWalletRestart } = state.popover;

  return {
    isWalletRestart,
  };
};

const mapDispatchToProps = {
  closeWalletRestartModal,
  restartWalletStart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForceUpdateModal);
