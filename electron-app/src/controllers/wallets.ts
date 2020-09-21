import * as log from '../services/electronLogger';
import DialogManager from '../services/dialogmanager';
import { MENU_BACKUP_WALLET, MENU_IMPORT_WALLET } from '../constants';

export default class Wallet {
  async load(bw: Electron.BrowserWindow) {
    try {
      const dialogManager = new DialogManager();
      const paths = await dialogManager.getFilePath();
      bw.webContents.send(MENU_IMPORT_WALLET, { paths });
    } catch (err) {
      log.error(err);
    }
  }

  async backup(bw: Electron.BrowserWindow) {
    try {
      const dialogManager = new DialogManager();
      const paths = await dialogManager.saveFilePath();
      if (!paths.length) {
        throw new Error('No valid path available');
      }
      bw.webContents.send(MENU_BACKUP_WALLET, { paths });
      return true;
    } catch (err) {
      log.error(err);
      return false;
    }
  }
}
