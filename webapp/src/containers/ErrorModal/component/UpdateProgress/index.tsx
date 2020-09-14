import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import styles from '../../errorModal.module.scss';
import { Progress, Button } from 'reactstrap';
import {
  sendUpdateResponse,
  showAvailableUpdateResponse,
  closeUpdateModal,
} from '../../../../app/update.ipcRenderer';

interface UpdateModalProps {
  isUpdateError: string;
  updateAppinfo: any;
  postUpdateFlag: boolean;
  showUpdateAvailable: boolean;
  isUpdateStarted: boolean;
}

const UpdateModal: React.FunctionComponent<UpdateModalProps> = (
  props: UpdateModalProps
) => {
  const {
    updateAppinfo,
    showUpdateAvailable,
    postUpdateFlag,
    isUpdateStarted,
    isUpdateError,
  } = props;
  const percent = Number(updateAppinfo.percent || 0).toFixed(2);

  if (isUpdateError) {
    return (
      <>
        {isUpdateError}
        <div className='d-flex justify-content-end'>
          <Button className='ml-4' onClick={closeUpdateModal}>
            {I18n.t('alerts.closeBtnLabel')}
          </Button>
        </div>
      </>
    );
  }

  if (showUpdateAvailable) {
    return (
      <>
        <p className='text-center'>
          {I18n.t('alerts.showUpdateAvailableNotice')}
        </p>
        <div className='d-flex justify-content-end'>
          <Button color='primary' onClick={() => showAvailableUpdateResponse()}>
            {I18n.t('alerts.yesShowUpdateAvailableButton')}
          </Button>
          <Button className='ml-4' onClick={closeUpdateModal}>
            {I18n.t('alerts.noShowUpdateAvailableButton')}
          </Button>
        </div>
      </>
    );
  }

  if (postUpdateFlag) {
    return (
      <>
        <p className='text-center'>{I18n.t('alerts.updateAppNoticeline1')}</p>
        <p className='text-center'>{I18n.t('alerts.updateAppNoticeline2')}</p>
        <div className='d-flex justify-content-end'>
          <Button color='primary' onClick={() => sendUpdateResponse()}>
            {I18n.t('alerts.yesUpdateAppNotice')}
          </Button>
          <Button className='ml-4' onClick={closeUpdateModal}>
            {I18n.t('alerts.noUpdateAppNotice')}
          </Button>
        </div>
      </>
    );
  }

  if (isUpdateStarted) {
    return (
      <>
        <div className={styles.errorModal}>
          <Progress animated color='info' value={percent} />
          <p className='text-center'>{percent}</p>
        </div>
      </>
    );
  }

  return <div />;
};

const mapStateToProps = (state) => {
  const {
    isUpdateError,
    updateAppinfo,
    postUpdateFlag,
    showUpdateAvailable,
    isUpdateStarted,
  } = state.errorModal;
  return {
    isUpdateError,
    updateAppinfo,
    postUpdateFlag,
    showUpdateAvailable,
    isUpdateStarted,
  };
};

export default connect(mapStateToProps)(UpdateModal);
