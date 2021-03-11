import React from 'react';
import { Progress, ModalBody, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { minimizeDownloadProgressModal } from '../reducer';
import BigNumber from 'bignumber.js';

interface DownloadProgressComponentProps {
  updateAppInfo: any;
  minimizeDownloadProgressModal: () => void;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { updateAppInfo, minimizeDownloadProgressModal } = props;
  const percent = new BigNumber(updateAppInfo.percent || 0).toFixed(2);
  const minimize = () => minimizeDownloadProgressModal();
  return (
    <>
      <ModalBody>
        <h1 className='h4'>
          {I18n.t('alerts.downloadingUpdate')}
          <Button
            size='xs'
            color='link'
            className='float-right p-0'
            onClick={minimize}
          >
            &minus;
          </Button>
        </h1>
        <p className='text-center'>{percent} %</p>
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
