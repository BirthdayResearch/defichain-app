import {
  handleUpdateError,
  updateComplete,
  updateProgress,
  handleShowUpdateAvailableBadge,
  handleCloseUpdateAvailable,
  handleClosePostUpdate,
  handleCloseUpdateApp,
} from './service';
import { ipcRendererFunc, isElectron } from '../utils/isElectron';
import { UPDATE_MODAL_CLOSE_TIMEOUT } from '../constants';

const initUpdateAppIpcRenderers = () => {
  const ipcRenderer = ipcRendererFunc();

  ipcRenderer.on('show-update-available', async () => {
    handleShowUpdateAvailableBadge();
  });

  ipcRenderer.on('download-progress', async (event: any, arg: any) => {
    updateProgress(arg);
  });

  ipcRenderer.on('update-downloaded', async (event: any) => {
    updateComplete();
  });

  ipcRenderer.on('update-downloaded-error', async (event: any, args: any) => {
    handleUpdateError(args);
  });
};

export const sendUpdateResponse = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send('post-update-action');
  }
  closeUpdateModal(handleClosePostUpdate);
};

export const showAvailableUpdateResponse = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send('start-download-update');
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
    await ipcRenderer.sendSync('wallet-backup');
  }
};

export default initUpdateAppIpcRenderers;
