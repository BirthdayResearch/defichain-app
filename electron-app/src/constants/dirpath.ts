import path from 'path';
import { app } from 'electron';
import { rootPath } from 'electron-root-path';
import {
  getPlatform,
  isDataDirDefined,
  getCustomDebugLogFilePath,
  checkPathExists,
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

export const BINARY_FILE_NAME = getPlatform() === 'win' ? 'defid.exe' : 'defid';
export const BINARY_FILE_PATH = IS_DEV
  ? path.join(rootPath, './binary', getPlatform())
  : IS_PACKAGED
  ? path.join(__dirname, '../../../../..', 'binary', getPlatform())
  : path.join(rootPath, '../', 'binary', getPlatform());

export const CONFIG_FILE_PATH = path.join(HOME_PATH, '/.defi', 'defi.conf');

export const DEBUG_LOG_FILE_PATH =
  checkPathExists(CONFIG_FILE_PATH) && isDataDirDefined(CONFIG_FILE_PATH)
    ? path.join(getCustomDebugLogFilePath(CONFIG_FILE_PATH), 'debug.log')
    : getDefaultDebugLogFilePath(HOME_PATH);
