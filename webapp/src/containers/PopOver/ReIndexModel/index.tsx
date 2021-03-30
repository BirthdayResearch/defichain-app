import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { restartNodeWithReIndexing, closeApp } from '../../../utils/isElectron';
import {
  closeReIndexModal,
  isRestartLoader,
  openDownloadSnapshotModal,
  updateDownloadSnapshotStep,
} from '../../PopOver/reducer';
import { I18n } from 'react-redux-i18n';
import { startSetNodeVersion } from '../../RpcConfiguration/reducer';
import { onStartSnapshotRequest, stopBinary } from '../../../app/service';
import styles from '../popOver.module.scss';
import { DownloadSnapshotSteps } from '../types';
import { shutDownBinary } from '../../../worker/queue';
import { MAIN } from '../../../constants';

interface ReIndexModalProps {
  isReIndexModelOpen: boolean;
  reIndexMessage?: string;
  activeNetwork: string;
  closeReIndexModal: () => void;
  isRestartLoader: () => void;
  startSetNodeVersion: () => void;
  openDownloadSnapshotModal: (isOpen: boolean) => void;
  updateDownloadSnapshotStep: (step: DownloadSnapshotSteps) => void;
}

const ReIndexModal: React.FunctionComponent<ReIndexModalProps> = (
  props: ReIndexModalProps
) => {
  const {
    closeReIndexModal,
    isRestartLoader,
    isReIndexModelOpen,
    reIndexMessage,
    startSetNodeVersion,
    openDownloadSnapshotModal,
    updateDownloadSnapshotStep,
    activeNetwork,
  } = props;

  const restartAppWithReIndexing = () => {
    closeReIndexModal();
    isRestartLoader();
    const params = {
      isReindexReq: true,
      skipVersionCheck: true,
      isDeletePeersAndBlocksreq: true,
    };
    startSetNodeVersion();
    restartNodeWithReIndexing(params);
  };

  const startDownloadSnapshot = async () => {
    closeReIndexModal();
    startSetNodeVersion();
    await shutDownBinary();
    stopBinary();
    openDownloadSnapshotModal(true);
    updateDownloadSnapshotStep(DownloadSnapshotSteps.DownloadSnapshot);
    onStartSnapshotRequest();
  };

  const closePopupAndApp = () => {
    closeReIndexModal();
    closeApp();
  };

  return (
    <Modal isOpen={isReIndexModelOpen} centered className={styles.reindexModal}>
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
      </ModalBody>
      <ModalFooter>
        <Button
          color='link'
          size='sm'
          className='mr-auto'
          onClick={closePopupAndApp}
        >
          {I18n.t('alerts.noCloseApp')}
        </Button>
        <Button size='sm' color='link' onClick={restartAppWithReIndexing}>
          {I18n.t('alerts.syncNode')}
        </Button>
        {activeNetwork === MAIN && (
          <Button size='sm' color='primary' onClick={startDownloadSnapshot}>
            {I18n.t('alerts.downloadSnapshot')}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isReIndexModelOpen, reIndexMessage } = state.popover;
  const { activeNetwork } = state.app;

  return {
    isReIndexModelOpen,
    reIndexMessage,
    activeNetwork,
  };
};

const mapDispatchToProps = {
  closeReIndexModal,
  isRestartLoader,
  startSetNodeVersion,
  openDownloadSnapshotModal,
  updateDownloadSnapshotStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReIndexModal);
