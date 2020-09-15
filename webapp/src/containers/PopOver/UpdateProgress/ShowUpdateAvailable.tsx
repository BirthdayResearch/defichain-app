import React from 'react';
import { Button } from 'reactstrap';
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
  return (
    <>
      <p className='text-center'>
        {I18n.t('alerts.showUpdateAvailableNotice')}
      </p>
      <div className='d-flex justify-content-end'>
        <Button color='primary' onClick={() => showAvailableUpdateResponse()}>
          {I18n.t('alerts.yesShowUpdateAvailableButton')}
        </Button>
        <Button
          className='ml-4'
          onClick={() => closeModal(closeUpdateAvailable)}
        >
          {I18n.t('alerts.noShowUpdateAvailableButton')}
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = () => {};

const mapDispatchToProps = {
  closeUpdateAvailable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowUpdateAvailableComponent);
