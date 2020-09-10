import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import styles from '../../errorModal.module.scss';
import { Progress, Button } from 'reactstrap';
import { sendUpdateResponse } from '../../../../app/update.ipcRenderer';

interface UpdateModalProps {
  isUpdateError: string;
  updateAppinfo: any;
  postUpdateFlag: boolean;
}

const UpdateModal: React.FunctionComponent<UpdateModalProps> = (
  props: UpdateModalProps
) => {
  const percent = Number(props.updateAppinfo.percent).toFixed(2);
  return (
    <>
      {props.postUpdateFlag ? (
        <div>
          <p className='text-center'>{I18n.t('alerts.updateAppNoticeline1')}</p>
          <p className='text-center'>{I18n.t('alerts.updateAppNoticeline2')}</p>
          <div className='d-flex justify-content-end'>
            <Button color='primary' onClick={() => sendUpdateResponse(true)}>
              {I18n.t('alerts.yesUpdateAppNotice')}
            </Button>
            <Button className='ml-4' onClick={() => sendUpdateResponse(false)}>
              {I18n.t('alerts.noUpdateAppNotice')}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.errorModal}>
          <Progress animated color='info' value={percent} />
          <p className='text-center'>{percent}</p>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { isUpdateError, updateAppinfo, postUpdateFlag } = state.errorModal;
  return {
    isUpdateError,
    updateAppinfo,
    postUpdateFlag,
  };
};

export default connect(mapStateToProps)(UpdateModal);
