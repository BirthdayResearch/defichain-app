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
      <ModalHeader className='p-0'>
        <Button size='xs' color='link' onClick={closing}>
          X
        </Button>
      </ModalHeader>
      <ModalBody>
        <p className='text-center'>{I18n.t('alerts.updateAppNoticeline1')}</p>
        <p className='text-center'>{I18n.t('alerts.updateAppNoticeline2')}</p>
      </ModalBody>
      <ModalFooter>
        <div className='d-flex justify-content-end'>
          <Button color='primary' onClick={() => sendUpdateResponse()}>
            {I18n.t('alerts.yesUpdateAppNotice')}
          </Button>
          <Button className='ml-4' onClick={closing}>
            {I18n.t('alerts.noUpdateAppNotice')}
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};

const mapStateToProps = () => {};

const mapDispatchToProps = {
  closePostUpdate,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostUpdateComponent);
