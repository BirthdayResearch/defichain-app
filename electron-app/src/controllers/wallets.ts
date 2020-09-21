import path from 'path';
import * as log from '../services/electronLogger';
import DialogManager from '../services/dialogmanager';
import {
  MENU_BACKUP_WALLET,
  MENU_IMPORT_WALLET,
  START_BACKUP_WALLET_DAT,
  WALLET_DAT,
} from '../constants';
import { copyFile, getBaseFolder } from '../utils';
import DefiProcessManager from '../services/defiprocessmanager';

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
      if (DefiProcessManager.isStartedNode) {
        const dialogManager = new DialogManager();
        const paths = await dialogManager.saveFilePath();
        if (!paths.length) {
          throw new Error('No valid path available');
        }
        bw.webContents.send(MENU_BACKUP_WALLET, { paths });
      } else {
        bw.webContents.send(START_BACKUP_WALLET_DAT);
      }
      return true;
    } catch (err) {
      log.error(err);
      return false;
    }
  }

  async backupWalletDat() {
    const dialogManager = new DialogManager();
    const paths = await dialogManager.saveFilePath([
      { name: 'Wallet', extensions: ['dat'] },
    ]);
    const baseFolder = getBaseFolder();
    const src = path.join(baseFolder, WALLET_DAT);
    return copyFile(src, paths);
  }
}
