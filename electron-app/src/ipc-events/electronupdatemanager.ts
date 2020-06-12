import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';

export default function initiateElectronUpdateManager() {
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      message: `update available`,
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      message: `update downloaded`,
    });
  });

  autoUpdater.on('error', (error) => {
    dialog.showMessageBox({
      message: `error while updating ${error}`,
    });
  });
  
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message =
      log_message +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')';
    dialog.showMessageBox({
      message: log_message,
    });
  });
}
