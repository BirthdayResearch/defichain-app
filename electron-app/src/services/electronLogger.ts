import log from 'loglevel';
import electronLogger from 'electron-log';
import {
  DEFAULT_ELECTRON_LOG_BASE_UNIT,
  DEFAULT_ELECTRON_LOG_SIZE,
} from '../constants';

electronLogger.transports.file.maxSize =
  DEFAULT_ELECTRON_LOG_BASE_UNIT * DEFAULT_ELECTRON_LOG_SIZE;

const info = (text: string) => {
  electronLogger.log(text);
  log.info(text);
};

const error = (text: string) => {
  electronLogger.error(text);
  log.error(text);
};

const logFilePath = () => {
  return electronLogger.transports.file.findLogPath();
};

export { info, error, logFilePath };
