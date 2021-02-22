import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { restartNodeWithReIndexing, closeApp } from '../../../utils/isElectron';
import { closeReIndexModal, isRestartLoader } from '../../PopOver/reducer';
import { I18n } from 'react-redux-i18n';
import ToggleButton from './component/ToggleButton';

interface ReIndexModalProps {
  isReIndexModelOpen: boolean;
  reIndexMessage?: string;
  closeReIndexModal: () => void;
  isRestartLoader: () => void;
}

const ReIndexModal: React.FunctionComponent<ReIndexModalProps> = (
  props: ReIndexModalProps
) => {
  const {
    closeReIndexModal,
    isRestartLoader,
    isReIndexModelOpen,
    reIndexMessage,
  } = props;
  const [peers, setPeers] = useState(true);

  const handleDeletePeersAndblocks = () => {
    const deletePeersAndBlocks = !peers;
    setPeers(deletePeersAndBlocks);
  };

  const restartAppWithReIndexing = () => {
    closeReIndexModal();
    isRestartLoader();
    const params = {
      isReindexReq: true,
      skipVersionCheck: true,
      isDeletePeersAndBlocksreq: peers,
    };
    restartNodeWithReIndexing(params);
  };

  const closePopupAndApp = () => {
    closeReIndexModal();
    closeApp();
  };

  return (
    <Modal isOpen={isReIndexModelOpen} centered>
      <ModalBody>
        <h1 className='h4'>
          {I18n.t(
            !reIndexMessage
              ? 'alerts.reindexModelHeader'
              : 'alerts.nodeVersionHeader'
          )}
        </h1>

        <p>
          {reIndexMessage != null && reIndexMessage != ''
            ? reIndexMessage
            : I18n.t('alerts.restartAppWithReindexNotice')}
        </p>
        {!reIndexMessage && (
          <ToggleButton
            handleToggles={handleDeletePeersAndblocks}
            label={'deletePeersAndBlocks'}
            field={peers}
            fieldName={'deletePeersAndBlocks'}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color='link'
          size='sm'
          className='ml-4'
          onClick={closePopupAndApp}
        >
          {I18n.t('alerts.noCloseApp')}
        </Button>
        <Button size='sm' color='primary' onClick={restartAppWithReIndexing}>
          {I18n.t('alerts.yesRestartAppWithReindex')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isReIndexModelOpen, reIndexMessage } = state.popover;

  return {
    isReIndexModelOpen,
    reIndexMessage,
  };
};

const mapDispatchToProps = {
  closeReIndexModal,
  isRestartLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReIndexModal);
