import {
  handleUpdateError,
  updateComplete,
  updateProgress,
  handleShowUpdateAvailable,
  handleCloseUpdateApp,
} from './service';
import { ipcRendererFunc, isElectron } from '../utils/isElectron';

const initUpdateAppIpcRenderers = () => {
  const ipcRenderer = ipcRendererFunc();

  ipcRenderer.on('show-update-available', async () => {
    handleShowUpdateAvailable();
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
  closeUpdateModal();
};

export const showAvailableUpdateResponse = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send('start-download-update');
  }
  closeUpdateModal();
};

export const closeUpdateModal = () => {
  handleUpdateError();
  handleCloseUpdateApp();
};

export default initUpdateAppIpcRenderers;
