import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { closeUpdateApp } from '../reducer';

interface DownloadProgressComponentProps {
  isUpdateError: string;
  closeUpdateApp: () => void;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { isUpdateError, closeUpdateApp } = props;
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
};

const mapStateToProps = ({ popover }) => ({
  isUpdateError: popover.isUpdateError,
});

const mapDispatchToProps = {
  closeUpdateApp,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadProgressComponent);
