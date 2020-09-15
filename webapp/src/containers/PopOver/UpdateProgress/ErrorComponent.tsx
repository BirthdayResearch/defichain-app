import React from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
      <ModalHeader className='p-0'>
        <Button size='xs' color='link' onClick={closeUpdateApp}>
          X
        </Button>
      </ModalHeader>
      <ModalBody>
        <p className='text-center'>{isUpdateError}</p>
      </ModalBody>
      <ModalFooter>
        <div className='d-flex justify-content-end'>
          <Button className='ml-4' onClick={closeUpdateApp}>
            {I18n.t('alerts.closeBtnLabel')}
          </Button>
        </div>
      </ModalFooter>
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
