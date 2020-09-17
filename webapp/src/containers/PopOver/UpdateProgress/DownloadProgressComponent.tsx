import React from 'react';
import { Progress, ModalBody, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { minimizeDownloadProgressModal } from '../reducer';

interface DownloadProgressComponentProps {
  updateAppInfo: any;
  minimizeDownloadProgressModal: () => void;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { updateAppInfo, minimizeDownloadProgressModal } = props;
  const percent = Number(updateAppInfo.percent || 0).toFixed(2);
  const minimize = () => minimizeDownloadProgressModal();
  return (
    <>
      <ModalHeader toggle={minimize} charCode='-'>
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
  minimizeDownloadProgressModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadProgressComponent);
