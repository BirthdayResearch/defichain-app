import path from 'path';
import { app } from 'electron';
import { rootPath } from 'electron-root-path';
import {
  getPlatform,
  isDataDirDefined,
  getCustomDebugLogFilePath,
  getDefaultDebugLogFilePath,
} from '../utils';
import { path7za } from '7zip-bin';
import { MAC } from './app';

export const DEFI_CONF_DIR = '.defi';
export const DEFI_CONF = 'defi.conf';
export const APP_NAME = app.name;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PACKAGED = app.isPackaged;

export const BASE_HOME_PATH = app.getPath('home');
export const HOME_PATH =
  getPlatform() === MAC
    ? getDefaultDebugLogFilePath(BASE_HOME_PATH)
    : BASE_HOME_PATH;
export const APP_DIR = path.join(HOME_PATH, `./${DEFI_CONF_DIR}`);
export const CONFIG_FILE_NAME = path.join(APP_DIR, `/${DEFI_CONF}`);
export const PID_FILE_NAME = path.join(APP_DIR, '/defi.pid');

export const NODE_LOG_FILE_NAME = 'debug.log';

export const UNZIP_FILE_PATH = IS_DEV
  ? path7za
  : path7za.replace('app.asar', 'app.asar.unpacked');
export const NODE_FILE_NAME = getPlatform() === 'win' ? 'defid.exe' : 'defid';
export const NODE_FILE_PATH = IS_DEV
  ? path.join(rootPath, './bin', getPlatform())
  : IS_PACKAGED
  ? path.join(__dirname, '../../../../../..', 'bin', getPlatform())
  : path.join(rootPath, '../', 'bin', getPlatform());

export const CONFIG_FILE_PATH_LEGACY = path.join(
  BASE_HOME_PATH,
  `/${DEFI_CONF_DIR}`,
  `${DEFI_CONF}`
);

export const CONFIG_FILE_PATH = path.join(
  HOME_PATH,
  `/${DEFI_CONF_DIR}`,
  `${DEFI_CONF}`
);

export const BASE_FILE_PATH = isDataDirDefined(CONFIG_FILE_PATH)
  ? path.join(getCustomDebugLogFilePath(CONFIG_FILE_PATH))
  : getDefaultDebugLogFilePath(BASE_HOME_PATH);

export const DEBUG_LOG_FILE_PATH = path.join(
  BASE_FILE_PATH,
  NODE_LOG_FILE_NAME
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
export const SNAPSHOT_FOLDER = 'snapshot';
export const ANCHORS_FOLDER = 'anchors';
export const BLOCKS_FOLDER = 'blocks';
export const BURN_FOLDER = 'burn';
export const CHAINSTATE_FOLDER = 'chainstate';
export const ENHANCEDCS_FOLDER = 'enhancedcs';
export const HISTORY_FOLDER = 'history';
export const INDEXES_FOLDER = 'indexes';
export const SPV_FOLDER = 'spv';
