import path from 'path';
import { app } from 'electron';
import { rootPath } from 'electron-root-path';
import {
  getPlatform,
  isDataDirDefined,
  getCustomDebugLogFilePath,
  getDefaultDebugLogFilePath,
} from '../utils';

export const APP_NAME = app.name;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PACKAGED =
  process.mainModule.filename.indexOf('app.asar') !== -1;

export const HOME_PATH = app.getPath('home');
export const APP_DIR = path.join(HOME_PATH, './.defi');
export const CONFIG_FILE_NAME = path.join(APP_DIR, '/defi.conf');
export const UI_CONFIG_FILE_NAME = path.join(APP_DIR, '/defi.ui.yaml');
export const PID_FILE_NAME = path.join(APP_DIR, '/defi.pid');

export const BINARY_LOG_FILE_NAME = 'debug.log';

export const BINARY_FILE_NAME = getPlatform() === 'win' ? 'defid.exe' : 'defid';
export const BINARY_FILE_PATH = IS_DEV
  ? path.join(rootPath, './binary', getPlatform())
  : IS_PACKAGED
  ? path.join(__dirname, '../../../../../..', 'binary', getPlatform())
  : path.join(rootPath, '../', 'binary', getPlatform());

export const CONFIG_FILE_PATH = path.join(HOME_PATH, '/.defi', 'defi.conf');

export const BASE_FILE_PATH = isDataDirDefined(CONFIG_FILE_PATH)
  ? path.join(getCustomDebugLogFilePath(CONFIG_FILE_PATH))
  : getDefaultDebugLogFilePath(HOME_PATH);

export const DEBUG_LOG_FILE_PATH = path.join(
  BASE_FILE_PATH,
  BINARY_LOG_FILE_NAME
);

export const TESTNET_BASE_FOLDER = path.join(
  BASE_FILE_PATH,
  'testnet3',
  'wallets'
);

export const TESTNET_BASE_FOLDER_REINDEX = path.join(
  BASE_FILE_PATH,
  'testnet3'
);

export const REGTEST_BASE_FOLDER = path.join(
  BASE_FILE_PATH,
  'regtest',
  'wallets'
);

export const MAINNET_BASE_FOLDER =
  getPlatform() === 'linux'
    ? BASE_FILE_PATH
    : path.join(BASE_FILE_PATH, 'wallets');

export const MAINNET_BASE_FOLDER_REINDEX = BASE_FILE_PATH;
export const BLK_FILE = 'blk';
export const REV_FILE = 'rev';
export const WALLET_MAP_FILE = 'wallet_map.json';
