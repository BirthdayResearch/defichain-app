import { app, ipcMain } from 'electron';
import { POST_UPDATE_ACTION } from '../constants';

export default function initiateAppUpdateManager(autoUpdater: any) {
  ipcMain.on(POST_UPDATE_ACTION, (event: Electron.IpcMainEvent, args: any) => {
    if (args.isRestarted) {
      autoUpdater.quitAndInstall();
    }
    app.exit();
  });
}
