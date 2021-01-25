import { isElectron } from './isElectron';
import log from 'loglevel';
import {
  DEFAULT_ELECTRON_LOG_FORMAT,
  DEFAULT_ELECTRON_LOG_BASE_UNIT,
  DEFAULT_ELECTRON_LOG_SIZE,
} from '../constants';

const logger = () => {
  if (isElectron()) {
    const log = window.require('electron').remote.require('electron-log');
    log.transports.file.format = DEFAULT_ELECTRON_LOG_FORMAT;
    log.transports.file.maxSize =
      DEFAULT_ELECTRON_LOG_BASE_UNIT * DEFAULT_ELECTRON_LOG_SIZE;
    return log;
  }
  return false;
};

const info = (text, methodSource?: string) => {
  const electronLogger = logger();
  const logMessage = `${
    methodSource ? `[${methodSource}]` : ''
  } ${text?.toString()}`;
  if (electronLogger) {
    electronLogger.log(logMessage);
  }
  log.info(logMessage);
};

const error = (text: any, methodSource?: string): void => {
  try {
    const electronLogger = logger();
    const errorMessage = `${
      methodSource ? `[${methodSource}]` : ''
    } ${text?.toString()}`;
    if (electronLogger) {
      electronLogger.error(errorMessage);
    }
    log.error(errorMessage);
  } catch (error) {
    log.error(text);
    log.error(error);
  }
};

const logFilePath = () => {
  const electronLogger = logger();
  if (electronLogger) {
    return electronLogger.transports.file.findLogPath();
  }
  return false;
};

export default logger;
export { info, error, logFilePath };
