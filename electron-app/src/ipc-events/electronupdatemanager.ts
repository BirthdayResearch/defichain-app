import {
  UPDATE_PROGRESS_VALUE,
  UPDATE_PROGRESS_COMPLETED,
  UPDATE_PROGRESS_FAILURE,
  SHOW_UPDATE_AVAILABLE,
  UPDATE_AVAILABLE,
  ERROR,
} from '@defi_types/ipcEvents';

export default function initiateElectronUpdateManager(
  autoUpdater: any,
  bw: Electron.BrowserWindow
) {
  autoUpdater.on(UPDATE_AVAILABLE, () => {
    bw.webContents.send(SHOW_UPDATE_AVAILABLE);
  });

  autoUpdater.on(UPDATE_PROGRESS_VALUE, (event: any) => {
    bw.webContents.send(UPDATE_PROGRESS_VALUE, event);
  });

  autoUpdater.on(UPDATE_PROGRESS_COMPLETED, () => {
    bw.webContents.send(UPDATE_PROGRESS_COMPLETED);
  });

  autoUpdater.on(ERROR, (error: any) => {
    bw.webContents.send(UPDATE_PROGRESS_FAILURE, error);
  });
}
