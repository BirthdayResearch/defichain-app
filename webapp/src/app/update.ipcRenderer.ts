import { handleUpdateError, updateComplete, updateProgress } from './service';
import { ipcRendererFunc, isElectron } from '../utils/isElectron';

const initUpdateAppIpcRenderers = () => {
  const ipcRenderer = ipcRendererFunc();
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

export const sendUpdateResponse = (isRestarted: boolean) => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send('post-update-action', {
      isRestarted,
    });
    handleUpdateError();
  }
};

export default initUpdateAppIpcRenderers;
