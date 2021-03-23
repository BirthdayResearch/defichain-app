import * as base64 from 'base-64';
import * as fs from 'fs';
import * as ps from 'ps-node';
import * as utf8 from 'utf8';
import cryptoJs from 'crypto-js';
import { platform } from 'os';
import ini from 'ini';
import path from 'path';
import {
  DARWIN,
  WIN_32,
  LINUX,
  AIX,
  FREEBSD,
  OPENBSD,
  ANDROID,
  SUNOS,
  WIN,
  CONFIG_FILE_NAME,
  MAINNET_BASE_FOLDER,
  REGTEST_BASE_FOLDER,
  TESTNET_BASE_FOLDER,
  BLK_FILE,
  REV_FILE,
  TESTNET_BASE_FOLDER_REINDEX,
  MAINNET_BASE_FOLDER_REINDEX,
} from './constants';
import { DAT_FILE_TYPE } from '@defi_types/fileExtensions';
import * as log from '././services/electronLogger';
import { IPCResponseModel } from '@defi_types/common';
import { ADDNODE, MASTERNODE_OPERATOR } from '../../typings/rpcConfig';

export const getPlatform = () => {
  switch (platform()) {
    case AIX:
    case FREEBSD:
    case LINUX:
    case OPENBSD:
    case ANDROID:
      return 'linux';
    case DARWIN:
    case SUNOS:
      return 'mac';
    case WIN_32:
      return 'win';
  }
};

export const createResponseMessage = <T>(
  success: boolean,
  res: T
): IPCResponseModel<T> => {
  return { success, data: res };
};

export const responseMessage = <T>(
  success: boolean,
  res: T
): IPCResponseModel<T> => {
  if (success) {
    return { success: true, data: res };
  }
  return { success: false, ...res };
};

// Check file exists or not
export const checkPathExists = (filePath: string) => {
  return fs.existsSync(filePath);
};

// Check file exists or not
export const deleteFile = (filePath: string) => {
  return fs.unlinkSync(filePath);
};

// Check file exists or not
export const createDir = (dirPath: string) => {
  return fs.mkdirSync(dirPath);
};

// Get file data
export const getFileData = (filePath: string, format: string = 'utf-8') => {
  const fileData = fs.readFileSync(filePath, format);
  return formatConfigFileRead(fileData);
};

// Add squarebrackets masternode_operator in config file
export const formatConfigFileRead = (fileData: string) => {
  return fileData
    .replace(new RegExp(MASTERNODE_OPERATOR, 'gi'), `${MASTERNODE_OPERATOR}[]`)
    .replace(new RegExp(ADDNODE, 'gi'), `${ADDNODE}[]`);
};

// Remove squarebrackets masternode_operator in config file
export const formatConfigFileWrite = (fileData: string) => {
  return fileData
    .replace(/masternode_operator[\[\]']+/g, MASTERNODE_OPERATOR)
    .replace(/addnode[\[\]']+/g, ADDNODE);
};

// write / append on UI config file
export const writeFile = (filePath: string, data: any, append?: boolean) => {
  if (append && checkPathExists(filePath)) {
    return fs.appendFileSync(filePath, data);
  } else {
    return fs.writeFileSync(filePath, data, 'utf8');
  }
};

export const generatePassword = () => {
  //  Create 32 byte password
  const salt = cryptoJs.lib.WordArray.random(32);
  const encoded = base64.encode(salt.toString());
  const bytes = base64.decode(encoded);
  return utf8.decode(bytes);
};

//  get default RPC auth
export const getRpcAuth = (rpcuser: string) => {
  const rpcpassword = generatePassword();
  return {
    rpcuser,
    rpcpassword,
    rpcauth: formatRPCAuth(rpcuser, rpcpassword),
  };
};

export const formatRPCAuth = (rpcuser: string, rpcpassword: string) => {
  return `${rpcuser}:${rpcpassword}`;
};

export const getProcesses = (args: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    ps.lookup(args, (err: any, result: unknown) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const stopProcesses = (processId: number | string) => {
  return getProcesses({ pid: parseInt(processId?.toString(), 10) }).then(
    (processes: any[]) => {
      if (processes != null && processes[0] != null) {
        return new Promise((resolve, reject) => {
          ps.kill(processId, 'SIGTERM', (err: any, result: unknown) => {
            if (err) return reject(err);
            return resolve(result);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          return resolve(true);
        });
      }
    }
  );
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDefaultDebugLogFilePath(homePath: string) {
  const platform = getPlatform();
  if (platform === LINUX) {
    return path.join(homePath, '/.defi');
  }
  if (platform === WIN) {
    return path.join(homePath, 'AppData', 'Roaming', 'DeFi Blockchain');
  }
  return path.join(homePath, 'Library', 'Application Support', 'Defi');
}

export function getCustomDebugLogFilePath(configFilePath: string) {
  const data = getFileData(configFilePath);
  const config = ini.decode(data);
  return config && config.datadir ? config.datadir : '';
}

export function isDataDirDefined(configFilePath: string) {
  if (!checkPathExists(configFilePath)) {
    return false;
  }

  const debugLogFilePath = getCustomDebugLogFilePath(configFilePath);
  return debugLogFilePath.length > 0;
}

export const copyFile = (src: fs.PathLike, dest: fs.PathLike) => {
  return fs.copyFileSync(src, dest);
};

export const getIniData = (fileName: string) => {
  if (checkPathExists(fileName)) {
    const data = getFileData(fileName, 'utf-8');
    return ini.parse(data);
  }
  return {};
};

export const getBaseFolder = () => {
  const data = getIniData(CONFIG_FILE_NAME);
  let baseFolder = MAINNET_BASE_FOLDER;
  if (data.testnet && parseInt(data.testnet, 10)) {
    baseFolder = TESTNET_BASE_FOLDER;
  }
  if (data.regtest && parseInt(data.regtest, 10)) {
    baseFolder = REGTEST_BASE_FOLDER;
  }
  return baseFolder;
};

export const getBaseFolderReindex = () => {
  const data = getIniData(CONFIG_FILE_NAME);
  let baseFolder = MAINNET_BASE_FOLDER_REINDEX;
  if (data.testnet && parseInt(data.testnet, 10)) {
    baseFolder = TESTNET_BASE_FOLDER_REINDEX;
  }
  if (data.regtest && parseInt(data.regtest, 10)) {
    baseFolder = REGTEST_BASE_FOLDER;
  }
  return baseFolder;
};

export const deletePeersFile = () => {
  try {
    const baseFolder = getBaseFolderReindex();
    const destFileName = `peers.dat`;
    const destFilePath = path.join(baseFolder, destFileName);
    if (checkPathExists(destFilePath)) {
      deleteFile(destFilePath);
      log.info(`Deleted peers file in ${destFilePath}`);
    }
  } catch (error) {
    log.error(error);
  }
};

export const deleteBlocksAndRevFiles = () => {
  try {
    log.info('Starting Delete Block and Rev Files...');
    const baseFolder = getBaseFolderReindex();
    const destFolder = path.join(baseFolder, 'blocks');
    fs.readdirSync(destFolder).forEach((file) => {
      const blkFile = path.join(destFolder, file);
      if (
        file?.endsWith(DAT_FILE_TYPE) &&
        (file?.includes(BLK_FILE) || file?.includes(REV_FILE))
      ) {
        log.info(`Deleting ${blkFile}...`);
        if (checkPathExists(blkFile)) {
          deleteFile(blkFile);
        }
      }
    });
    log.info('Delete Block and Rev Files completed...');
  } catch (error) {
    log.error(error);
  }
};

export const deleteBanlist = () => {
  try {
    const baseFolder = getBaseFolderReindex();
    const destFileName = `banlist.dat`;
    const destFilePath = path.join(baseFolder, destFileName);
    if (checkPathExists(destFilePath)) {
      deleteFile(destFilePath);
      log.info(`Deleted banlist file in ${destFilePath}`);
    }
  } catch (error) {
    log.error(error);
  }
};
