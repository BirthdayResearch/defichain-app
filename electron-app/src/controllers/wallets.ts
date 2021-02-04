import path from 'path';
import * as log from '../services/electronLogger';
import DialogManager from '../services/dialogmanager';
import { WALLET_DAT, WALLET_MAP_FILE } from '../constants';
import {
  MENU_BACKUP_WALLET,
  MENU_IMPORT_WALLET,
  RESET_BACKUP_WALLET,
  START_BACKUP_WALLET,
} from '@defi_types/ipcEvents';
import {
  checkPathExists,
  copyFile,
  deleteFile,
  getBaseFolder,
  responseMessage,
} from '../utils';
import fs from 'fs';

const saveFileDailog = async (
  extensions: { name: string; extensions: string[] }[]
) => {
  const dialogManager = new DialogManager();
  const paths = await dialogManager.saveFilePath(extensions);
  if (!paths.length) {
    throw new Error('No valid path available');
  }
  return paths;
};

export const createWalletMap = () => {
  try {
    const baseFolder = getBaseFolder();
    const src = path.join(baseFolder, WALLET_MAP_FILE);
    if (!checkPathExists(src)) {
      const walletDat = path.join(baseFolder, WALLET_DAT);
      fs.writeFileSync(
        src,
        JSON.stringify(
          {
            walletMap: {
              paths: [walletDat],
            },
          },
          null,
          4
        )
      );
    }
  } catch (error) {
    log.error(error);
  }
};

export const addWalletPath = async () => {
  try {
    const baseFolder = getBaseFolder();
    const src = path.join(baseFolder, WALLET_MAP_FILE);
  } catch (error) {
    log.error(error);
  }
};

const appendExtension = (paths: string, extension: string) => {
  const isDatFile = paths.lastIndexOf('.');
  return isDatFile === -1 ? `${paths}.${extension}` : paths;
};

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
      const paths = await saveFileDailog([
        { name: 'Text file', extensions: ['txt'] },
      ]);

      bw.webContents.send(MENU_BACKUP_WALLET, {
        paths: appendExtension(paths, 'txt'),
      });
      return responseMessage(true, {});
    } catch (err) {
      log.error(err);
      return responseMessage(false, {
        message: err.message,
      });
    }
  }

  async backupWalletDat() {
    const paths = await saveFileDailog([
      { name: 'Wallet', extensions: ['dat'] },
    ]);
    const dest = appendExtension(paths, 'dat');
    const baseFolder = getBaseFolder();
    const src = path.join(baseFolder, WALLET_DAT);
    return copyFile(src, dest);
  }

  async replaceWalletDat() {
    const baseFolder = getBaseFolder();
    const destFileName = `wallet-bak-${Date.now()}.dat`;
    const destFilePath = path.join(baseFolder, destFileName);
    const srcFilePath = path.join(baseFolder, WALLET_DAT);
    copyFile(srcFilePath, destFilePath);
    deleteFile(srcFilePath);
  }

  async startBackupWallet(bw: Electron.BrowserWindow) {
    bw.webContents.send(START_BACKUP_WALLET);
  }

  async resetWallet(bw: Electron.BrowserWindow) {
    bw.webContents.send(RESET_BACKUP_WALLET);
  }
}
