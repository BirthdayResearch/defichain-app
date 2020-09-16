import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { restartNodeWithReIndexing, closeApp } from '../../../utils/isElectron';
import { closeReIndexModal, isRestartLoader } from '../reducer';
import ReIndexComponent from './ReIndexComponent';
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
    <div>
      <Modal isOpen={isReIndexModelOpen} centered>
        <ReIndexComponent
          restartAppWithReIndexing={restartAppWithReIndexing}
          closePopupAndApp={closePopupAndApp}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isReIndexModelOpen } = state.errorModal;

  return {
    isReIndexModelOpen,
  };
};

const mapDispatchToProps = {
  closeReIndexModal,
  isRestartLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReIndexModal);
