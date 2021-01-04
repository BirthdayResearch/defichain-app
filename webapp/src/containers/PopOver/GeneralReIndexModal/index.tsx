import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { restartNode } from '../../../utils/isElectron';
import {
  closeGeneralReIndexModal,
  isRestartLoader,
  restartModal,
} from '../reducer';
import { I18n } from 'react-redux-i18n';
import { shutDownBinary } from '../../../worker/queue';

interface GeneralReIndexModalProps {
  isGeneralReindexModalOpen: boolean;
  closeGeneralReIndexModal: () => void;
  isRestartLoader: () => void;
  restartModal: () => void;
}

const GeneralReIndexModal: React.FunctionComponent<GeneralReIndexModalProps> = (
  props: GeneralReIndexModalProps,
) => {
  const {
    closeGeneralReIndexModal,
    isGeneralReindexModalOpen,
    restartModal,
  } = props;

  const restartAppWithReIndexing = () => {
    closeGeneralReIndexModal();
    restartModal();
    shutDownBinary();
    restartNode({ isReindexReq: true });
  };

  return (
    <Modal isOpen={isGeneralReindexModalOpen} centered>
      <ModalBody>
        <h1 className="h4">{I18n.t('alerts.reindexModelHeader')}</h1>
        <p>{I18n.t('alerts.restartAppWithReindexNotice')}</p>
      </ModalBody>
      <ModalFooter>
        <Button size="sm" color="primary" onClick={restartAppWithReIndexing}>
          {I18n.t('alerts.yesRestartAppWithReindex')}
        </Button>
        <Button size="sm" className="ml-4" onClick={closeGeneralReIndexModal}>
          {I18n.t('alerts.noCloseApp')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { isGeneralReindexModalOpen } = state.popover;

  return {
    isGeneralReindexModalOpen,
  };
};

const mapDispatchToProps = {
  closeGeneralReIndexModal,
  isRestartLoader,
  restartModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeneralReIndexModal);
