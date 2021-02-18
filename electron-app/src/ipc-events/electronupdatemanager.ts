import {
  UPDATE_PROGRESS_VALUE,
  UPDATE_PROGRESS_COMPLETED,
  UPDATE_PROGRESS_FAILURE,
  SHOW_UPDATE_AVAILABLE,
  UPDATE_AVAILABLE,
  ERROR,
} from '@defi_types/ipcEvents';
import { AppUpdater } from 'electron-updater/out/AppUpdater';

export default function initiateElectronUpdateManager(
  autoUpdater: AppUpdater,
  bw: Electron.BrowserWindow
) {
  autoUpdater.on(UPDATE_AVAILABLE, (info: { version: string }) => {
    bw.webContents.send(SHOW_UPDATE_AVAILABLE, info.version);
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
