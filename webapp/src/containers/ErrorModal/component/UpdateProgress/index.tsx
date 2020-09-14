import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import styles from '../../errorModal.module.scss';
import { Progress, Button, Row, Col } from 'reactstrap';
import {
  sendUpdateResponse,
  showAvailableUpdateResponse,
} from '../../../../app/update.ipcRenderer';
import {
  closeUpdateApp,
  closePostUpdate,
  closeUpdateAvailable,
} from '../../reducer';
import { UPDATE_MODAL_CLOSE_TIMEOUT } from '../../../../constants';

interface UpdateModalProps {
  isUpdateError: string;
  updateAppinfo: any;
  postUpdateFlag: boolean;
  showUpdateAvailable: boolean;
  isUpdateStarted: boolean;
  closeUpdateApp: () => void;
  closePostUpdate: () => void;
  closeUpdateAvailable: () => void;
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
    closeUpdateApp,
    closePostUpdate,
    closeUpdateAvailable,
  } = props;

  const percent = Number(updateAppinfo.percent || 0).toFixed(2);

  const closeModal = (fn) => {
    closeUpdateApp();
    setTimeout(fn, UPDATE_MODAL_CLOSE_TIMEOUT);
  };

  if (isUpdateError) {
    return (
      <>
        <p className='text-center'>{isUpdateError}</p>
        <div className='d-flex justify-content-end'>
          <Button className='ml-4' onClick={closeUpdateApp}>
            {I18n.t('alerts.closeBtnLabel')}
          </Button>
        </div>
      </>
    );
  }

  const loadHtml = () => {
    if (showUpdateAvailable) {
      return (
        <>
          <p className='text-center'>
            {I18n.t('alerts.showUpdateAvailableNotice')}
          </p>
          <div className='d-flex justify-content-end'>
            <Button
              color='primary'
              onClick={() => showAvailableUpdateResponse()}
            >
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
            <Button
              className='ml-4'
              onClick={() => closeModal(closePostUpdate)}
            >
              {I18n.t('alerts.noUpdateAppNotice')}
            </Button>
          </div>
        </>
      );
    }

    if (isUpdateStarted) {
      return (
        <>
          <p className='text-center'>{I18n.t('alerts.downloadingUpdate')}</p>
          <div className={styles.errorModal}>
            <Progress animated color='info' value={percent}>
              {percent} %
            </Progress>
          </div>
        </>
      );
    }

    return <div />;
  };
  return (
    <Row>
      {isUpdateStarted && (
        <Col xs={12}>
          <div className='float-right'>
            <Button size='xs' onClick={closeUpdateApp} color='link'>
              _
            </Button>
          </div>
        </Col>
      )}
      <Col xs={12}>{loadHtml()}</Col>
    </Row>
  );
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

const mapDispatchToProps = {
  closeUpdateApp,
  closePostUpdate,
  closeUpdateAvailable,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateModal);
