import React from 'react';
import { Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import styles from '../popOver.module.scss';

interface DownloadProgressComponentProps {
  updateAppinfo: any;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { updateAppinfo } = props;
  const percent = Number(updateAppinfo.percent || 0).toFixed(2);
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
};

const mapStateToProps = ({ popover }) => ({
  updateAppinfo: popover.updateAppinfo,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadProgressComponent);
