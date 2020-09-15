import React from 'react';
import { Button } from 'reactstrap';
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
  return (
    <>
      <p className='text-center'>{I18n.t('alerts.updateAppNoticeline1')}</p>
      <p className='text-center'>{I18n.t('alerts.updateAppNoticeline2')}</p>
      <div className='d-flex justify-content-end'>
        <Button color='primary' onClick={() => sendUpdateResponse()}>
          {I18n.t('alerts.yesUpdateAppNotice')}
        </Button>
        <Button className='ml-4' onClick={() => closeModal(closePostUpdate)}>
          {I18n.t('alerts.noUpdateAppNotice')}
        </Button>
      </div>
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
