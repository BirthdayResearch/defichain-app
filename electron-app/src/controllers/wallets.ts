import path from 'path';
import * as log from '../services/electronLogger';
import DialogManager from '../services/dialogmanager';
import {
  CONFIG_FILE_NAME,
  DAT_FILE,
  DAT_FILE_TYPE,
  WALLET_DAT,
  WALLET_MAP_FILE,
} from '../constants';
import {
  MENU_BACKUP_WALLET,
  MENU_IMPORT_WALLET,
  ON_WALLET_BACKUP_REQUEST,
  ON_WALLET_MAP_REPLACE,
  ON_WALLET_MAP_REQUEST,
  ON_WALLET_RESTORE_VIA_BACKUP,
  ON_WALLET_RESTORE_VIA_RECENT,
  ON_WALLET_RESTORE_VIA_RECENT_CHECK,
  RESET_BACKUP_WALLET,
  START_BACKUP_WALLET,
} from '@defi_types/ipcEvents';
import {
  checkPathExists,
  copyFile,
  deleteFile,
  getBaseFolder,
  getIniData,
  responseMessage,
  writeFile,
} from '../utils';
import fs from 'fs';
import { ipcMain } from 'electron';
import { WalletMap } from '@defi_types/walletMap';
import ini from 'ini';
import { ParsedPath } from 'path';

const saveFileDialog = async (
  extensions: { name: string; extensions: string[] }[]
) => {
  const dialogManager = new DialogManager();
  const paths = await dialogManager.saveFilePath(extensions);
  if (!paths.length) {
    throw new Error('No valid path available');
  }
  return paths;
};

export const writeToConfigFile = (
  parsedPath?: ParsedPath,
  network?: string
) => {
  try {
    const data = getIniData(CONFIG_FILE_NAME);
    data[network] = data[network] || {};
    if (parsedPath != null) {
      data[network].wallet = parsedPath.base;
      data[network].walletdir = parsedPath.dir;
    } else {
      delete data[network].wallet;
      delete data[network].walletdir;
    }
    const defaultConfigData = ini.encode(data);
    writeFile(CONFIG_FILE_NAME, defaultConfigData);
  } catch (error) {
    log.error(error);
  }
};

export const getWalletMapPath = () => {
  try {
    const baseFolder = getBaseFolder();
    const src = path.join(baseFolder, WALLET_MAP_FILE);
    return src;
  } catch (error) {
    log.error(error);
  }
};

export const getWalletMap = () => {
  try {
    const src = getWalletMapPath();
    if (checkPathExists(src)) {
      const data = fs.readFileSync(src, 'utf8');
      console.log(data);
      return data;
    }
  } catch (error) {
    log.error(error);
  }
};

export const setWalletEvents = () => {
  ipcMain.on(ON_WALLET_MAP_REQUEST, async (event: Electron.IpcMainEvent) => {
    try {
      event.returnValue = responseMessage(true, getWalletMap());
    } catch (error) {
      event.returnValue = responseMessage(false, {
        message: error.message,
      });
    }
  });

  ipcMain.on(
    ON_WALLET_MAP_REPLACE,
    async (event: Electron.IpcMainEvent, walletMap: WalletMap) => {
      try {
        overwriteWalletMap(walletMap);
      } catch (error) {
        log.error(error);
      }
    }
  );

  ipcMain.on(
    ON_WALLET_RESTORE_VIA_BACKUP,
    async (event: Electron.IpcMainEvent, network: string) => {
      try {
        const dialogManager = new DialogManager();
        const filePath = await dialogManager.getFilePath();
        const parsedPath = path.parse(filePath[0]);
        if (parsedPath.ext === DAT_FILE_TYPE) {
          writeToConfigFile(parsedPath, network);
          event.returnValue = responseMessage(true, filePath[0]);
        } else {
          throw new Error(`File selected is not a valid ${DAT_FILE} type.`);
        }
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
      }
    }
  );

  ipcMain.on(
    ON_WALLET_RESTORE_VIA_RECENT_CHECK,
    async (event: Electron.IpcMainEvent, filePath: string) => {
      try {
        if (checkPathExists(filePath)) {
          event.returnValue = responseMessage(true, filePath);
        } else {
          throw new Error(`File selected does not exist.`);
        }
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
      }
    }
  );

  ipcMain.on(
    ON_WALLET_RESTORE_VIA_RECENT,
    async (event: Electron.IpcMainEvent, filePath: string, network: string) => {
      try {
        if (checkPathExists(filePath)) {
          const parsedPath = path.parse(filePath);
          writeToConfigFile(parsedPath, network);
          event.returnValue = responseMessage(true, filePath);
        } else {
          throw new Error(`File selected does not exist.`);
        }
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
      }
    }
  );

  ipcMain.on(ON_WALLET_BACKUP_REQUEST, async (event: Electron.IpcMainEvent) => {
    try {
      const paths = await saveFileDialog([
        { name: DAT_FILE.toUpperCase(), extensions: [DAT_FILE] },
      ]);

      event.returnValue = responseMessage(true, {
        paths: appendExtension(paths, DAT_FILE),
      });
    } catch (error) {
      log.error(error);
      event.returnValue = responseMessage(false, {
        message: error.message,
      });
    }
  });
};

export const createWalletMap = () => {
  try {
    const src = getWalletMapPath();
    if (!checkPathExists(src)) {
      const walletDat = path.join(getBaseFolder(), WALLET_DAT);
      const data = {
        paths: [walletDat],
      };
      fs.writeFileSync(src, JSON.stringify(data, null, 4));
    }
    setWalletEvents();
  } catch (error) {
    log.error(error);
  }
};

export const overwriteWalletMap = async (data: WalletMap) => {
  try {
    const src = getWalletMapPath();
    if (checkPathExists(src)) {
      fs.writeFileSync(src, JSON.stringify(data, null, 4));
    }
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
      const paths = await saveFileDialog([
        { name: DAT_FILE.toUpperCase(), extensions: [DAT_FILE] },
      ]);

      bw.webContents.send(MENU_BACKUP_WALLET, {
        paths: appendExtension(paths, DAT_FILE),
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
    const paths = await saveFileDialog([
      { name: 'Wallet', extensions: [DAT_FILE] },
    ]);
    const dest = appendExtension(paths, DAT_FILE);
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
