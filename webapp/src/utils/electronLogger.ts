import { ipcRendererFunc, isElectron } from './isElectron';
import log from 'loglevel';
import { APP_LOG } from '@defi_types/ipcEvents';

const logger = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    return {
      log: (message) => {
        ipcRenderer.invoke(APP_LOG, message, true);
      },
      error: (message) => {
        ipcRenderer.invoke(APP_LOG, message, false);
      }
    };
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

export default logger;
export { info, error };
