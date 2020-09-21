import React from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { sendUpdateResponse } from '../../../app/update.ipcRenderer';
import { closePostUpdate } from '../reducer';

interface PostUpdateComponentProps {
  closePostUpdate: () => void;
  closeModal: (fn: any) => void;
}

const PostUpdateComponent = (props: PostUpdateComponentProps) => {
  const { closePostUpdate, closeModal } = props;
  const closing = () => closeModal(closePostUpdate);
  return (
    <>
      <ModalBody>
        <h1 className='h4'>{I18n.t('alerts.updateAppNoticeTitle')}</h1>
        {I18n.t('alerts.updateAppNotice')}
      </ModalBody>
      <ModalFooter>
        <Button size='sm' color='primary' onClick={() => sendUpdateResponse()}>
          {I18n.t('alerts.yesUpdateAppNotice')}
        </Button>
        <Button size='sm' onClick={closing}>
          {I18n.t('alerts.noUpdateAppNotice')}
        </Button>
      </ModalFooter>
    </>
  );
};

const mapDispatchToProps = {
  closePostUpdate,
};

export default connect(null, mapDispatchToProps)(PostUpdateComponent);
