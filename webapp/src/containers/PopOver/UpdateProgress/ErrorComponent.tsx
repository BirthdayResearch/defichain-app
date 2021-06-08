import React from 'react';
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { closeUpdateApp } from '../reducer';
import openNewTab from '../../../utils/openNewTab';
import { SITE_DOWNLOADS } from '@defi_types/settings';
import { getSiteURL } from '../../../constants';

interface DownloadProgressComponentProps {
  isUpdateError: string;
  closeUpdateApp: () => void;
}

const DownloadProgressComponent = (props: DownloadProgressComponentProps) => {
  const { isUpdateError, closeUpdateApp } = props;
  const onDownloadClick = () => {
    openNewTab(`${getSiteURL()}${SITE_DOWNLOADS}`);
    closeUpdateApp();
  };
  return (
    <>
      <ModalBody>{isUpdateError}</ModalBody>
      <ModalFooter>
        <Button size='sm' color='link' onClick={closeUpdateApp}>
          {I18n.t('alerts.closeBtnLabel')}
        </Button>
        <Button size='sm' color='primary' onClick={onDownloadClick}>
          {I18n.t('alerts.download')}
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
