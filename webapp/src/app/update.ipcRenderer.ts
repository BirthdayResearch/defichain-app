import {
  handleUpdateError,
  updateComplete,
  updateProgress,
  handleShowUpdateAvailableBadge,
  handleCloseUpdateAvailable,
  handleClosePostUpdate,
  handleCloseUpdateApp,
  showErrorNotification,
  handleShowUpdateForcedModal,
} from './service';
import { ipcRendererFunc, isElectron } from '../utils/isElectron';
import { UPDATE_MODAL_CLOSE_TIMEOUT, PACKAGE_VERSION } from '../constants';
import {
  CREATE_MNEMONIC,
  ENABLE_RESET_MENU,
  POST_UPDATE_ACTION,
  SHOW_UPDATE_AVAILABLE,
  START_DOWNLOAD_UPDATE,
  UPDATE_PROGRESS_COMPLETED,
  UPDATE_PROGRESS_FAILURE,
  UPDATE_PROGRESS_VALUE,
  WALLET_BACKUP,
} from '@defi_types/ipcEvents';
import * as log from '../utils/electronLogger';
import { I18n } from 'react-redux-i18n';
import { triggerNodeShutdown } from '../worker/queue';
import semver from 'semver/preload';

export function shouldForceUpdate(version: string): boolean {
  switch (semver.diff(PACKAGE_VERSION, version)) {
    case 'major':
    case 'minor':
      return true;
    default:
      return false;
  }
}

const initUpdateAppIpcRenderers = () => {
  const ipcRenderer = ipcRendererFunc();

  ipcRenderer.on(SHOW_UPDATE_AVAILABLE, async (version: string) => {
    if (shouldForceUpdate(version)) {
      handleShowUpdateForcedModal();
    } else {
      handleShowUpdateAvailableBadge();
    }
  });

  ipcRenderer.on(UPDATE_PROGRESS_VALUE, async (event: any, arg: any) => {
    updateProgress(arg);
  });

  ipcRenderer.on(UPDATE_PROGRESS_COMPLETED, async (event: any) => {
    updateComplete();
  });

  ipcRenderer.on(UPDATE_PROGRESS_FAILURE, async (event: any, args: any) => {
    log.error(args, 'Update failed');
    handleUpdateError(I18n.t('general.updateFailed'));
  });
};

export const sendUpdateResponse = async () => {
  if (isElectron()) {
    log.error(`Update trigger node shutdown...`);
    await triggerNodeShutdown(false);
    log.error(`Update node shutdown success...`);
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(POST_UPDATE_ACTION);
  }
  closeUpdateModal(handleClosePostUpdate);
};

export const showAvailableUpdateResponse = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(START_DOWNLOAD_UPDATE);
  }
  closeUpdateModal(handleCloseUpdateAvailable);
};

export const closeUpdateModal = (closingFunc) => {
  handleCloseUpdateApp();
  setTimeout(closingFunc, UPDATE_MODAL_CLOSE_TIMEOUT);
};

export const backupWallet = async () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    const resp = await ipcRenderer.sendSync(WALLET_BACKUP);
    if (!resp.success) {
      showErrorNotification(resp);
    }
    return resp.success;
  }
  return false;
};

export const createMnemonicIpcRenderer = async (
  mnemonic,
  network,
  networkType
) => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    return await ipcRenderer.sendSync(CREATE_MNEMONIC, {
      mnemonic,
      network,
      networkType,
    });
  }
};

export const enableMenuResetWalletBtn = (isWalletCreatedFlag: boolean) => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(ENABLE_RESET_MENU, { isWalletCreatedFlag });
  }
};
export default initUpdateAppIpcRenderers;
