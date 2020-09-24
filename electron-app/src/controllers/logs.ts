import * as log from '../services/electronLogger';
import DialogManager from '../services/dialogmanager';
import { getFileData, writeFile } from '../utils';

export default class Logs {
  async download(data: string, extension: string) {
    try {
      const dialogManager = new DialogManager();
      const paths = await dialogManager.saveFilePath();
      if (!paths.length) {
        throw new Error('No valid path available');
      }
      paths.slice(-5).includes(extension)
        ? writeFile(paths, data)
        : writeFile(paths + extension, data);
    } catch (err) {
      log.error(err);
    }
  }

  async read(filePath: string) {
    try {
      const data = getFileData(filePath);
      return data;
    } catch (err) {
      log.error(err);
    }
  }
}
