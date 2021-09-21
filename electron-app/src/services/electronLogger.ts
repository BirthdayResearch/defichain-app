import log from 'loglevel';
import ElectronLogger from 'electron-log';
import {
  DEFAULT_ELECTRON_LOG_BASE_UNIT,
  DEFAULT_ELECTRON_LOG_SIZE,
  DEFAULT_ELECTRON_FORMAT,
  DEFAULT_ELECTRON_RENDERER_FORMAT,
} from '../constants';

ElectronLogger.transports.file.format = DEFAULT_ELECTRON_FORMAT;
ElectronLogger.transports.file.maxSize =
  DEFAULT_ELECTRON_LOG_BASE_UNIT * DEFAULT_ELECTRON_LOG_SIZE;

const info = (text: string, shouldLogConsole: boolean = true) => {
  if (shouldLogConsole) {
    log.info(text);
    ElectronLogger.transports.file.format = DEFAULT_ELECTRON_FORMAT;
  } else {
    ElectronLogger.transports.file.format = DEFAULT_ELECTRON_RENDERER_FORMAT;
  }
  ElectronLogger.log(text);
};

const error = (text: string, shouldLogConsole: boolean = true) => {
  if (shouldLogConsole) {
    log.error(text);
    ElectronLogger.transports.file.format = DEFAULT_ELECTRON_FORMAT;
  } else {
    ElectronLogger.transports.file.format = DEFAULT_ELECTRON_RENDERER_FORMAT;
  }
  ElectronLogger.error(text);
};

const logFilePath = () => {
  return ElectronLogger.transports.file.findLogPath();
};

export { info, error, logFilePath };

export default ElectronLogger;
