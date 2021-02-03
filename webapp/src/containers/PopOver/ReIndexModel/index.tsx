import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { restartNodeWithReIndexing, closeApp } from '../../../utils/isElectron';
import { closeReIndexModal, isRestartLoader } from '../../PopOver/reducer';
import { I18n } from 'react-redux-i18n';
import ToggleButton from './component/ToggleButton';

interface ReIndexModalProps {
  isReIndexModelOpen: boolean;
  closeReIndexModal: () => void;
  isRestartLoader: () => void;
}

const ReIndexModal: React.FunctionComponent<ReIndexModalProps> = (
  props: ReIndexModalProps
) => {
  const { closeReIndexModal, isRestartLoader, isReIndexModelOpen } = props;
  const [peers, setPeers] = useState(false);

  const handlePeersAndFbloacks = () => {
    const peersAndBlocks = !peers;
    setPeers(peersAndBlocks);
  };

  const restartAppWithReIndexing = () => {
    closeReIndexModal();
    isRestartLoader();
    if (peers) {
      restartNodeWithReIndexing({
        isReindexReq: true,
        isPeersAndBlocksreq: true,
      });
    } else {
      restartNodeWithReIndexing({ isReindexReq: true });
    }
  };

  const closePopupAndApp = () => {
    closeReIndexModal();
    closeApp();
  };

  return (
    <Modal isOpen={isReIndexModelOpen} centered>
      <ModalBody>
        <h1 className='h4'>{I18n.t('alerts.reindexModelHeader')}</h1>
        <p>{I18n.t('alerts.restartAppWithReindexNotice')}</p>
        <ToggleButton
          handleToggles={handlePeersAndFbloacks}
          label={'peersAndBlocks'}
          field={peers}
          fieldName={'peersAndBlocks'}
        />
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
