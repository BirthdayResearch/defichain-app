import React from 'react';
import { Progress, ModalBody, ModalHeader, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import styles from '../popOver.module.scss';
import { closeUpdateApp } from '../reducer';

interface DownloadProgressComponentProps {
  updateAppinfo: any;
  closeUpdateApp: () => void;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { updateAppinfo, closeUpdateApp } = props;
  const percent = Number(updateAppinfo.percent || 0).toFixed(2);
  return (
    <>
      <ModalHeader className='p-0'>
        <Button size='xs' color='link' onClick={closeUpdateApp}>
          _
        </Button>
      </ModalHeader>
      <ModalBody>
        <p className='text-center'>{I18n.t('alerts.downloadingUpdate')}</p>
        <div className={styles.errorModal}>
          <Progress animated color='info' value={percent}>
            {percent} %
          </Progress>
        </div>
      </ModalBody>
    </>
  );
};

const mapStateToProps = ({ popover }) => ({
  updateAppinfo: popover.updateAppinfo,
});

const mapDispatchToProps = {
  closeUpdateApp,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadProgressComponent);
