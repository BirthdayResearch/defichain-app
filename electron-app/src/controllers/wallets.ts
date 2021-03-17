import path from 'path';
import * as log from '../services/electronLogger';
import DialogManager from '../services/dialogmanager';
import { CONFIG_FILE_NAME, WALLET_MAP_FILE } from '../constants';
import {
  MENU_BACKUP_WALLET,
  MENU_IMPORT_WALLET,
  ON_FILE_SELECT_REQUEST,
  ON_WALLET_MAP_REPLACE,
  ON_WALLET_MAP_REQUEST,
  ON_WALLET_RESTORE_VIA_BACKUP,
  ON_WRITE_CONFIG_REQUEST,
  ON_FILE_EXIST_CHECK,
  RESET_BACKUP_WALLET,
  START_BACKUP_WALLET,
  ON_DEFAULT_WALLET_PATH_REQUEST,
  ON_SET_NODE_VERSION,
  ON_OVERWRITE_CONFIG_REQUEST,
} from '@defi_types/ipcEvents';
import {
  checkPathExists,
  copyFile,
  getBaseFolder,
  getIniData,
  responseMessage,
  writeFile,
  formatConfigFileWrite,
} from '../utils';
import fs from 'fs';
import { ipcMain } from 'electron';
import { WalletMap } from '@defi_types/walletMap';
import {
  DAT_FILE,
  DAT_FILE_TYPE,
  WALLET_DAT,
} from '@defi_types/fileExtensions';
import ini from 'ini';
import { ParsedPath } from 'path';
import packageInfo from '../../../package.json';
import {
  CONFIG_DISABLED,
  NetworkTypes,
  RPCConfigItem,
} from '@defi_types/rpcConfig';

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

export const createOrGetWalletMap = () => {
  return getWalletMap() != null
    ? JSON.parse(getWalletMap())
    : createWalletMap();
};

/**
 * @description - Check if wallet path is still existing
 */
export const checkWalletConfig = () => {
  try {
    const data = getIniData(CONFIG_FILE_NAME);
    const networks = [NetworkTypes.MAIN, NetworkTypes.TEST];
    networks.forEach((network) => {
      if (
        data[network] != null &&
        data[network].wallet != null &&
        data[network].walletdir != null
      ) {
        const walletPath = path.join(
          data[network].walletdir,
          data[network].wallet
        );
        if (!checkPathExists(walletPath)) {
          delete data[network].wallet;
          delete data[network].walletdir;
        }
      }
    });
    const defaultConfigData = ini.encode(data);
    const newData = formatConfigFileWrite(defaultConfigData);
    writeFile(CONFIG_FILE_NAME, newData);
  } catch (error) {
    log.error(error);
  }
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
      data[network].spv = CONFIG_DISABLED;
      data[network].gen = CONFIG_DISABLED;
    }
    const defaultConfigData = ini.encode(data);
    const newData = formatConfigFileWrite(defaultConfigData);
    writeFile(CONFIG_FILE_NAME, newData);
  } catch (error) {
    log.error(error);
  }
};

export const overwriteConfigFile = (data: RPCConfigItem) => {
  try {
    const defaultConfigData = ini.encode(data);
    const newData = formatConfigFileWrite(defaultConfigData);
    writeFile(CONFIG_FILE_NAME, newData, false);
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

  ipcMain.on(ON_SET_NODE_VERSION, async (event: Electron.IpcMainEvent) => {
    try {
      const walletMap = createOrGetWalletMap();
      const { ainVersion } = packageInfo;
      walletMap.nodeVersion = ainVersion;
      overwriteWalletMap(walletMap);
      event.returnValue = responseMessage(true, JSON.stringify(walletMap));
    } catch (error) {
      log.error(error);
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
        event.returnValue = responseMessage(true, JSON.stringify(walletMap));
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
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
    ON_FILE_EXIST_CHECK,
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
    ON_WRITE_CONFIG_REQUEST,
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

  ipcMain.on(
    ON_OVERWRITE_CONFIG_REQUEST,
    async (event: Electron.IpcMainEvent, data: RPCConfigItem) => {
      try {
        overwriteConfigFile(data);
        event.returnValue = responseMessage(true, data);
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
      }
    }
  );

  ipcMain.on(
    ON_FILE_SELECT_REQUEST,
    async (
      event: Electron.IpcMainEvent,
      hasExtension: boolean = true,
      shouldAppendWalletPath: boolean = false
    ) => {
      try {
        const extension = hasExtension
          ? [{ name: DAT_FILE.toUpperCase(), extensions: [DAT_FILE] }]
          : [];
        const paths = await saveFileDialog(extension);
        const filePath = hasExtension
          ? appendExtension(paths, DAT_FILE)
          : paths;
        event.returnValue = responseMessage(true, {
          paths: filePath,
          walletPath: shouldAppendWalletPath
            ? path.join(paths, WALLET_DAT)
            : filePath,
        });
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
      }
    }
  );

  ipcMain.on(
    ON_DEFAULT_WALLET_PATH_REQUEST,
    async (event: Electron.IpcMainEvent) => {
      try {
        event.returnValue = responseMessage(true, {
          paths: getBaseFolder(),
          walletPath: path.join(getBaseFolder(), WALLET_DAT),
        });
      } catch (error) {
        log.error(error);
        event.returnValue = responseMessage(false, {
          message: error.message,
        });
      }
    }
  );
};

export const createWalletMap = (): Partial<WalletMap> => {
  try {
    const src = getWalletMapPath();

    if (!checkPathExists(getBaseFolder())) {
      log.info(`Wallets folder missing... Creating directory...`);
      fs.mkdirSync(getBaseFolder(), { recursive: true });
    }

    if (!checkPathExists(src)) {
      const walletDat = path.join(getBaseFolder(), WALLET_DAT);
      const { ainVersion } = packageInfo;
      const data: Partial<WalletMap> = {
        paths: [walletDat],
        nodeVersion: ainVersion,
        hasSyncSPV: false,
      };
      fs.writeFileSync(src, JSON.stringify(data, null, 4));
      return data;
    }
  } catch (error) {
    log.error(error);
  }
};

export const initializeWalletMap = () => {
  try {
    createWalletMap();
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

export const removeDefaultWalletFile = () => {
  try {
    const baseFolder = getBaseFolder();
    const srcFilePath = path.join(baseFolder, WALLET_DAT);
    if (checkPathExists(srcFilePath)) {
      const destFileName = `wallet-bak-${Date.now()}.dat`;
      const destFilePath = path.join(baseFolder, destFileName);
      copyFile(srcFilePath, destFilePath);
      log.info(`Backup file created in ${destFilePath}`);
    }
  } catch (error) {
    log.error(error);
  }
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
    removeDefaultWalletFile();
  }

  async startBackupWallet(bw: Electron.BrowserWindow) {
    bw.webContents.send(START_BACKUP_WALLET);
  }

  async resetWallet(bw: Electron.BrowserWindow) {
    bw.webContents.send(RESET_BACKUP_WALLET);
  }
}
