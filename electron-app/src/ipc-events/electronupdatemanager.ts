import { CancellationToken } from 'electron-updater';
import { dialog } from 'electron';
import {
  UPDATE_PROGRESS_VALUE,
  UPDATE_PROGRESS_COMPLETED,
  UPDATE_PROGRESS_FAILURE,
} from '../constants';

export default function initiateElectronUpdateManager(
  autoUpdater: any,
  bw: Electron.BrowserWindow
) {
  const cancellationToken = new CancellationToken();

  autoUpdater.on('update-available', () => {
    const options = {
      type: 'question',
      title: 'Update App',
      message: `A new version of Defi is available. Would you like to upgrade?`,
      buttons: ['Yes, Upgrade Now', 'Ask Me Later'],
    };

    dialog.showMessageBox(options).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate(cancellationToken);
      }
    });
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
