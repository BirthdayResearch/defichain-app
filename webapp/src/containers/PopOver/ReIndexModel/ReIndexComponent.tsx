import React from 'react';
import { MdClose } from 'react-icons/md';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { closeReIndexModal } from '../../PopOver/reducer';

interface Reindexcomponent {
  restartAppWithReIndexing: () => void;
  closePopupAndApp: () => void;
  closeReIndexModal: () => void;
}

const Reindexcomponent = (props) => {
  const {
    restartAppWithReIndexing,
    closePopupAndApp,
    closeReIndexModal,
  } = props;
  return (
    <>
      <ModalHeader>
        <MdClose onClick={closeReIndexModal} />
      </ModalHeader>
      <ModalBody>
        <p className='text-center'>
          {I18n.t('alerts.restartAppWithReindexNoticeline1')}
        </p>
        <p className='text-center'>
          {I18n.t('alerts.restartAppWithReindexNoticeline2')}
        </p>
      </ModalBody>
      <ModalFooter>
        <div className='d-flex justify-content-end'>
          <Button color='primary' onClick={restartAppWithReIndexing}>
            {I18n.t('alerts.yesRestartAppWithReindex')}
          </Button>
          <Button className='ml-4' onClick={closePopupAndApp}>
            {I18n.t('alerts.noCloseApp')}
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};

const mapStateToProps = () => {};

const mapDispatchToProps = {
  closeReIndexModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Reindexcomponent);
