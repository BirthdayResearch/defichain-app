import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, ModalHeader } from 'reactstrap';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { MdClose } from 'react-icons/md';
import { restartNodeWithReIndexing, closeApp } from '../../../utils/isElectron';
import { closeReIndexModal, isRestartLoader } from '../reducer';

interface ReIndexModalProps {
  isReIndexModelOpen: boolean;
  isReIndexRestart: boolean;
  closeReIndexModal: () => void;
  isRestartLoader: () => void;
}

const ReIndexModal: React.FunctionComponent<ReIndexModalProps> = (
  props: ReIndexModalProps
) => {
  const restartAppWithReIndexing = () => {
    props.closeReIndexModal();
    props.isRestartLoader();
    restartNodeWithReIndexing({ isReindexReq: true });
  };

  const closePopupAndApp = () => {
    props.closeReIndexModal();
    closeApp();
  };

  return (
    <div>
      <Modal isOpen={props.isReIndexModelOpen} centered>
        <ModalHeader>
          <MdClose onClick={props.closeReIndexModal} />
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
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isReIndexModelOpen, isReIndexRestart } = state.errorModal;

  return {
    isReIndexModelOpen,
    isReIndexRestart,
  };
};

const mapDispatchToProps = {
  closeReIndexModal,
  isRestartLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReIndexModal);
