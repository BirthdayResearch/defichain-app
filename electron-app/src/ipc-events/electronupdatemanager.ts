import { CancellationToken } from 'electron-updater';
import { app, dialog } from 'electron';
const ProgressBar = require('electron-progressbar');

import * as log from '../services/electronLogger';

export default function initiateElectronUpdateManager(autoUpdater: any) {
  const cancellationToken = new CancellationToken();
  let progressBar: any;

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

        progressBar = new ProgressBar({
          browserWindow: {
            text: 'Preparing data...',
            title: 'App Update',
            webPreferences: {
              nodeIntegration: true,
            },
          },
        });

        progressBar.detail = 'Downloading in progress...';
      }
    });
  });

  autoUpdater.on('download-progress', () => {
    progressBar.on('aborted', function () {
      cancellationToken.cancel();
    });
  });

  autoUpdater.on('update-downloaded', () => {
    progressBar.setCompleted();

    progressBar.on('completed', function () {
      progressBar.detail = 'Task completed. Exiting...';
      progressBar.close();
    });

    const options = {
      type: 'question',
      title: 'Restart App',
      message: `Would you like to restart to install new version?`,
      buttons: ['Yes, Restart Now', 'Close'],
    };
    dialog.showMessageBox(options).then((result) => {
      if (result.response === 0) {
        setImmediate(() => {
          autoUpdater.quitAndInstall();
        })
        // app.exit();
      }
    });
  });

  autoUpdater.on('error', (error: any) => {
    log.error(error);
  });
}
