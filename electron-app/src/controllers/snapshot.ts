import fs, { createWriteStream } from 'fs';
import * as log from '../services/electronLogger';
import { checkPathExists, deleteFile, getBaseFolder } from '../utils';
import path from 'path';
import { SNAPSHOT_FOLDER } from '../constants';
import axios from 'axios';
import { OFFICIAL_SNAPSHOT_URL, SNAPSHOT_FILENAME } from '@defi_types/snapshot';
import https from 'https';
import { IncomingMessage } from 'http';
import { ipcMain } from 'electron';
import {
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_START_REQUEST,
  ON_SNAPSHOT_UPDATE_PROGRESS,
} from '@defi_types/ipcEvents';

export interface FileSizesModel {
  remoteSize: number;
  localSize: number;
}

export const initializeSnapshotEvents = (bw: Electron.BrowserWindow) => {
  try {
    ipcMain.on(ON_SNAPSHOT_START_REQUEST, async () => {
      downloadSnapshot(bw);
    });
  } catch (error) {
    log.error(error);
  }
};

export const downloadSnapshot = async (
  bw: Electron.BrowserWindow
): Promise<boolean> => {
  try {
    return new Promise(async (resolve) => {
      const snapshotDirectory = createSnapshotDirectory();
      const fileSizes = {
        remoteSize: 0,
        localSize: 0,
      };
      const isSnapshotExisting = await checkIfSnapshotExist(
        snapshotDirectory,
        fileSizes
      );
      if (isSnapshotExisting) {
        onDownloadComplete(bw, fileSizes);
        resolve(true);
      } else {
        deleteSnapshotIfExisting(snapshotDirectory);
        startDownloadSnapshot(snapshotDirectory, bw, fileSizes);
      }
    });
  } catch (error) {
    log.error(error);
  }
};

export const createSnapshotDirectory = (): string => {
  try {
    const snapshotPath = path.join(getBaseFolder(), '../', SNAPSHOT_FOLDER);
    if (!checkPathExists(snapshotPath)) {
      fs.mkdirSync(snapshotPath, { recursive: true });
    }
    return path.join(snapshotPath, SNAPSHOT_FILENAME);
  } catch (error) {
    log.error(error);
  }
};

export const checkIfSnapshotExist = async (
  directory: string,
  fileSizes: FileSizesModel
): Promise<boolean> => {
  try {
    if (checkPathExists(directory)) {
      const response = await axios.head(OFFICIAL_SNAPSHOT_URL);
      fileSizes.remoteSize =
        +response.headers['content-length'] || fileSizes.remoteSize;
      fileSizes.localSize = fs.statSync(directory).size || fileSizes.localSize;
      return fileSizes.remoteSize === fileSizes.localSize;
    } else {
      return false;
    }
  } catch (error) {
    log.error(error);
  }
};

export const deleteSnapshotIfExisting = (directory: string): void => {
  try {
    if (checkPathExists(directory)) {
      deleteFile(directory);
    }
  } catch (error) {
    log.error(error);
  }
};

export const onDownloadComplete = (
  bw: Electron.BrowserWindow,
  fileSizes: FileSizesModel
) => {
  bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_COMPLETE, fileSizes);
};

export const startDownloadSnapshot = async (
  directory: string,
  bw: Electron.BrowserWindow,
  fileSizes: FileSizesModel
): Promise<any> => {
  try {
    let bytes = 0;
    const writer = createWriteStream(directory);
    return https.get(OFFICIAL_SNAPSHOT_URL, (response: IncomingMessage) => {
      response.pipe(writer);
      let error: Error = null;
      writer.on('error', (err: Error) => {
        error = err;
        writer.close();
      });
      writer.on('close', () => {
        if (!error) {
          onDownloadComplete(bw, fileSizes);
        } else {
          bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
        }
      });
      response.on('data', (chunk) => {
        bytes += chunk.length;
        bw.webContents.send(ON_SNAPSHOT_UPDATE_PROGRESS, {
          bytes,
          fileSizes,
        });
      });
    });
  } catch (error) {
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
    log.error(error);
    return false;
  }
};
