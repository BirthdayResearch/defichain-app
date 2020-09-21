import React from 'react';
import { connect } from 'react-redux';
import { closeUpdateApp } from '../reducer';
import { UPDATE_MODAL_CLOSE_TIMEOUT } from '../../../constants';
import ErrorComponent from './ErrorComponent';
import ShowUpdateAvailableComponent from './ShowUpdateAvailable';
import PostUpdateComponent from './PostUpdateComponent';
import DownloadProgressComponent from './DownloadProgressComponent';
import Backupwalletnotice from './BackupWalletNotice';

interface UpdateModalProps {
  isUpdateError: string;
  postUpdateFlag: boolean;
  showUpdateAvailable: boolean;
  isUpdateStarted: boolean;
  closeUpdateApp: () => void;
  backupWalletIsOpen: boolean;
}

const UpdateModal: React.FunctionComponent<UpdateModalProps> = (
  props: UpdateModalProps
) => {
  const {
    showUpdateAvailable,
    postUpdateFlag,
    isUpdateStarted,
    isUpdateError,
    closeUpdateApp,
    backupWalletIsOpen,
  } = props;

  const closeModal = (fn) => {
    closeUpdateApp();
    setTimeout(fn, UPDATE_MODAL_CLOSE_TIMEOUT);
  };

  const loadHtml = () => {
    if (isUpdateError) return <ErrorComponent />;

    if (showUpdateAvailable)
      return <ShowUpdateAvailableComponent closeModal={closeModal} />;

    if (postUpdateFlag) return <PostUpdateComponent closeModal={closeModal} />;

    if (isUpdateStarted) return <DownloadProgressComponent />;

    if (backupWalletIsOpen) return <Backupwalletnotice />;

    return <div />;
  };

  return <>{loadHtml()}</>;
};

const mapStateToProps = (state) => {
  const {
    isUpdateError,
    postUpdateFlag,
    showUpdateAvailable,
    isUpdateStarted,
    backupWalletIsOpen,
  } = state.popover;
  return {
    isUpdateError,
    postUpdateFlag,
    showUpdateAvailable,
    isUpdateStarted,
    backupWalletIsOpen,
  };
};

const mapDispatchToProps = {
  closeUpdateApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateModal);
