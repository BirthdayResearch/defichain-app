import { CancellationToken } from 'electron-updater';
import { dialog } from 'electron';

export default function initiateElectronUpdateManager(autoUpdater: any) {
  const cancellationToken = new CancellationToken();

  autoUpdater.on('update-available', () => {
    const options = {
      type: 'question',
      title: 'Update App',
      message: `Do you want to update app`,
      buttons: ['Upgrade now', 'Ask me later'],
    };

    dialog.showMessageBox(options).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate(cancellationToken);
      }
    });
  });

  autoUpdater.on('update-downloaded', () => {
    const options = {
      type: 'question',
      title: 'Restart App',
      message: `Do you want to restart now`,
      buttons: ['Restart', 'Close'],
    };

    dialog.showMessageBox(options).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (error: any) => {
    dialog.showMessageBox({
      message: `error while updating ${error}`,
    });
  });
}
