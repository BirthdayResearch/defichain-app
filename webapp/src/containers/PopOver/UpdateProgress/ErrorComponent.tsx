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
      <ModalHeader toggle={closeUpdateApp}>&nbsp;</ModalHeader>
      <ModalBody>{isUpdateError}</ModalBody>
      <ModalFooter>
        <Button size='sm' onClick={closeUpdateApp}>
          {I18n.t('alerts.closeBtnLabel')}
        </Button>
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
