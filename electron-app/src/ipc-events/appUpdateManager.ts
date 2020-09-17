import { CancellationToken } from 'electron-updater';
import { app, ipcMain } from 'electron';
import { POST_UPDATE_ACTION, START_DOWNLOAD_UPDATE } from '../constants';

export default function initiateAppUpdateManager(autoUpdater: any) {
  ipcMain.on(POST_UPDATE_ACTION, () => {
    autoUpdater.quitAndInstall();
    app.exit();
  });

  ipcMain.on(START_DOWNLOAD_UPDATE, () => {
    const cancellationToken = new CancellationToken();
    autoUpdater.downloadUpdate(cancellationToken);
  });
}
