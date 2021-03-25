import fs, { createWriteStream } from 'fs';
import * as log from '../services/electronLogger';
import { checkPathExists, deleteFile, getBaseFolder } from '../utils';
import path from 'path';
import { SNAPSHOT_FOLDER } from '../constants';
import axios from 'axios';
import {
  OFFICIAL_SNAPSHOT_URL,
  SNAPSHOT_FILENAME,
  FileSizesModel,
} from '@defi_types/snapshot';
import https from 'https';
import { IncomingMessage } from 'http';
import { ipcMain } from 'electron';
import {
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_START_REQUEST,
  ON_SNAPSHOT_UPDATE_PROGRESS,
} from '@defi_types/ipcEvents';

export const initializeSnapshotEvents = (bw: Electron.BrowserWindow) => {
  try {
    ipcMain.on(ON_SNAPSHOT_START_REQUEST, async () => {
      downloadSnapshot(bw);
    });
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const downloadSnapshot = async (
  bw: Electron.BrowserWindow
): Promise<boolean> => {
  try {
    return new Promise(async (resolve) => {
      const snapshotDirectory = createSnapshotDirectory(bw);
      const fileSizes = {
        remoteSize: 0,
        localSize: 0,
        completionRate: 0,
      };
      const isSnapshotExisting = await checkIfSnapshotExist(
        snapshotDirectory,
        fileSizes,
        bw
      );
      if (isSnapshotExisting) {
        onDownloadComplete(bw, fileSizes, snapshotDirectory);
        resolve(true);
      } else {
        deleteSnapshotIfExisting(snapshotDirectory, bw);
        startDownloadSnapshot(snapshotDirectory, bw, fileSizes);
      }
    });
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const createSnapshotDirectory = (bw: Electron.BrowserWindow): string => {
  try {
    const snapshotPath = path.join(getBaseFolder(), '../', SNAPSHOT_FOLDER);
    if (!checkPathExists(snapshotPath)) {
      fs.mkdirSync(snapshotPath, { recursive: true });
    }
    return path.join(snapshotPath, SNAPSHOT_FILENAME);
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const checkIfSnapshotExist = async (
  directory: string,
  fileSizes: FileSizesModel,
  bw: Electron.BrowserWindow
): Promise<boolean> => {
  try {
    const response = await axios.head(OFFICIAL_SNAPSHOT_URL);
    fileSizes.remoteSize =
      +response.headers['content-length'] || fileSizes.remoteSize;
    if (checkPathExists(directory)) {
      fileSizes.localSize = fs.statSync(directory).size || fileSizes.localSize;
      return fileSizes.remoteSize === fileSizes.localSize;
    } else {
      return false;
    }
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const deleteSnapshotIfExisting = (
  directory: string,
  bw: Electron.BrowserWindow
): void => {
  try {
    if (checkPathExists(directory)) {
      deleteFile(directory);
    }
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const onDownloadComplete = (
  bw: Electron.BrowserWindow,
  fileSizes: FileSizesModel,
  directory: string
) => {
  const bytes = fs.statSync(directory).size;
  updateFileSizes(bytes, fileSizes);
  if (fileSizes.completionRate >= 1) {
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_COMPLETE, fileSizes);
  } else {
    bw.webContents.send(
      ON_SNAPSHOT_DOWNLOAD_FAILURE,
      'File download incomplete'
    );
  }
};

const updateFileSizes = (bytes: number, fileSizes: FileSizesModel) => {
  fileSizes.localSize = bytes || 0;
  fileSizes.completionRate =
    fileSizes.remoteSize > 0 ? bytes / fileSizes.remoteSize : 0;
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
      let sendUpdate = false;
      const downloadInterval = setInterval(() => {
        sendUpdate = true;
      }, 60000);

      //* Downloading
      response.on('data', (chunk) => {
        bytes += chunk.length;
        if (sendUpdate) {
          sendUpdate = false;
          updateFileSizes(bytes, fileSizes);
          bw.webContents.send(ON_SNAPSHOT_UPDATE_PROGRESS, fileSizes);
        }
      });

      //* On error
      writer.on('error', (err: Error) => {
        error = err;
        writer.close();
      });

      //* On close
      writer.on('close', () => {
        if (downloadInterval) {
          clearInterval(downloadInterval);
        }
        if (!error) {
          onDownloadComplete(bw, fileSizes, directory);
        } else {
          bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
        }
      });
    });
  } catch (error) {
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
    log.error(error);
    return false;
  }
};
