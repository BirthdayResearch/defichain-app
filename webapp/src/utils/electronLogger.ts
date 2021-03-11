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

const textToString = (text: any) => {
  return text != null
    ? JSON.stringify(text.message != null ? text.message : text)
    : '';
};

const info = (text, methodSource?: string) => {
  const electronLogger = logger();
  const logMessage = `${methodSource ? `[${methodSource}]` : ''} ${textToString(
    text
  )}`;
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
    } ${textToString(text)}`;
    if (electronLogger) {
      electronLogger.error(errorMessage);
    }
    log.error(errorMessage);
  } catch (error) {
    log.error(textToString(text));
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
