import { dialog } from 'electron';
import { getBaseFolder } from '../utils';
import * as log from './electronLogger';

export default class DialogManager {
  // open directory model and allow to select directory
  async getDirectoryPath() {
    try {
      const res = await dialog.showOpenDialog(null, {
        properties: ['openDirectory'],
        defaultPath: getBaseFolder(),
      });
      if (res.canceled || !res.filePaths.length) {
        throw new Error('Directory not selected');
      }
      return res.filePaths;
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  // open file model and allow to select file
  async getFilePath(filters?: { name: string; extensions: string[] }[]) {
    try {
      const res = await dialog.showOpenDialog(null, {
        properties: ['openFile'],
        filters,
        defaultPath: getBaseFolder(),
      });
      if (res.canceled || !res.filePaths.length) {
        throw new Error('File not selected');
      }
      return res.filePaths;
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  async saveFilePath(filters?: { name: string; extensions: string[] }[]) {
    try {
      const res = await dialog.showSaveDialog(null, {
        properties: [
          'createDirectory',
          'showOverwriteConfirmation',
          'treatPackageAsDirectory',
        ],
        filters,
        defaultPath: getBaseFolder(),
      });
      if (res.canceled || !res.filePath) {
        throw new Error('File not selected');
      }
      return res.filePath;
    } catch (err) {
      log.error(err);
      throw err;
    }
  }
}
