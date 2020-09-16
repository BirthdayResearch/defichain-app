import React from 'react';
import { Progress, ModalBody, ModalHeader, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { closeUpdateApp } from '../reducer';

interface DownloadProgressComponentProps {
  updateAppInfo: any;
  closeUpdateApp: () => void;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { updateAppInfo, closeUpdateApp } = props;
  const percent = Number(updateAppInfo.percent || 0).toFixed(2);
  return (
    <>
      <ModalHeader toggle={closeUpdateApp} charCode='-'>
        {I18n.t('alerts.downloadingUpdate')}
      </ModalHeader>
      <ModalBody className='text-center'>
        <p>{percent} %</p>
        <Progress animated color='info' value={percent}></Progress>
      </ModalBody>
    </>
  );
};

const mapStateToProps = ({ popover }) => ({
  updateAppInfo: popover.updateAppInfo,
});

const mapDispatchToProps = {
  closeUpdateApp,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadProgressComponent);
