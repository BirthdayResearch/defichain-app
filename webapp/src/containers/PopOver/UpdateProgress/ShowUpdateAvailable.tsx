import React from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { showAvailableUpdateResponse } from '../../../app/update.ipcRenderer';
import { closeUpdateAvailable } from '../reducer';

interface ShowUpdateAvailableComponentProps {
  closeUpdateAvailable: () => void;
  closeModal: (fn: any) => void;
}

const ShowUpdateAvailableComponent = (
  props: ShowUpdateAvailableComponentProps
) => {
  const { closeUpdateAvailable, closeModal } = props;
  const closing = () => closeModal(closeUpdateAvailable);
  return (
    <>
      <ModalHeader toggle={closing}>
        {I18n.t('alerts.showUpdateAvailableHeader')}
      </ModalHeader>
      <ModalBody>{I18n.t('alerts.showUpdateAvailableNotice')}</ModalBody>
      <ModalFooter>
        <Button size='sm' color='primary' onClick={showAvailableUpdateResponse}>
          {I18n.t('alerts.yesShowUpdateAvailableButton')}
        </Button>
        <Button size='sm' onClick={closing}>
          {I18n.t('alerts.noShowUpdateAvailableButton')}
        </Button>
      </ModalFooter>
    </>
  );
};

const mapDispatchToProps = {
  closeUpdateAvailable,
};

export default connect(null, mapDispatchToProps)(ShowUpdateAvailableComponent);
