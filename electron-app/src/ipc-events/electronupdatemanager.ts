import {
  UPDATE_PROGRESS_VALUE,
  UPDATE_PROGRESS_COMPLETED,
  UPDATE_PROGRESS_FAILURE,
  SHOW_UPDATE_AVAILABLE,
} from '../constants';

export default function initiateElectronUpdateManager(
  autoUpdater: any,
  bw: Electron.BrowserWindow
) {
  autoUpdater.on('update-available', () => {
    bw.webContents.send(SHOW_UPDATE_AVAILABLE);
  });

  autoUpdater.on('download-progress', (event: any) => {
    bw.webContents.send(UPDATE_PROGRESS_VALUE, event);
  });

  autoUpdater.on('update-downloaded', () => {
    bw.webContents.send(UPDATE_PROGRESS_COMPLETED);
  });

  autoUpdater.on('error', (error: any) => {
    bw.webContents.send(UPDATE_PROGRESS_FAILURE, error);
  });
}
