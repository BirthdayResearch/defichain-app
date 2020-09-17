import log from 'loglevel';
import ElectronLogger from 'electron-log';
import {
  DEFAULT_ELECTRON_LOG_BASE_UNIT,
  DEFAULT_ELECTRON_LOG_SIZE,
  DEFAULT_ELECTRON_FORMAT,
} from '../constants';

ElectronLogger.transports.file.format = DEFAULT_ELECTRON_FORMAT;
ElectronLogger.transports.file.maxSize =
  DEFAULT_ELECTRON_LOG_BASE_UNIT * DEFAULT_ELECTRON_LOG_SIZE;

const info = (text: string) => {
  ElectronLogger.log(text);
  log.info(text);
};

const error = (text: string) => {
  ElectronLogger.error(text);
  log.error(text);
};

const logFilePath = () => {
  return ElectronLogger.transports.file.findLogPath();
};

export { info, error, logFilePath };

export default ElectronLogger;
