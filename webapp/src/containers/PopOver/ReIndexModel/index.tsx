import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { restartNodeWithReIndexing, closeApp } from '../../../utils/isElectron';
import { closeReIndexModal, isRestartLoader } from '../../PopOver/reducer';
import { I18n } from 'react-redux-i18n';

interface ReIndexModalProps {
  isReIndexModelOpen: boolean;
  closeReIndexModal: () => void;
  isRestartLoader: () => void;
}

const ReIndexModal: React.FunctionComponent<ReIndexModalProps> = (
  props: ReIndexModalProps
) => {
  const { closeReIndexModal, isRestartLoader, isReIndexModelOpen } = props;

  const restartAppWithReIndexing = () => {
    closeReIndexModal();
    isRestartLoader();
    restartNodeWithReIndexing({ isReindexReq: true });
  };

  const closePopupAndApp = () => {
    closeReIndexModal();
    closeApp();
  };

  return (
    <Modal isOpen={isReIndexModelOpen} centered>
      <ModalBody>
        <h1 className='h4'>{I18n.t('alerts.reindexModelHeader')}</h1>
        <label className='text-center'>
          {I18n.t('alerts.restartAppWithReindexNotice')}
        </label>
      </ModalBody>
      <ModalFooter>
        <Button size='sm' color='primary' onClick={restartAppWithReIndexing}>
          {I18n.t('alerts.yesRestartAppWithReindex')}
        </Button>
        <Button size='sm' className='ml-4' onClick={closePopupAndApp}>
          {I18n.t('alerts.noCloseApp')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isReIndexModelOpen } = state.popover;

  return {
    isReIndexModelOpen,
  };
};

const mapDispatchToProps = {
  closeReIndexModal,
  isRestartLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReIndexModal);
