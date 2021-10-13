import fs, { createWriteStream } from 'fs';
import * as log from '../services/electronLogger';
import {
  checkPathExists,
  deleteSnapshotFiles,
  deleteSnapshotFolders,
  getSnapshotFolder,
} from '../utils';
import path from 'path';
import { BASE_FILE_PATH, UNZIP_FILE_PATH } from '../constants';
import axios from 'axios';
import {
  FileSizesModel,
  getSnapshotFilename,
  SNAPSHOT_EU,
  SNAPSHOT_INDEX,
  SNAPSHOT_INFO,
} from '@defi_types/snapshot';
import https from 'https';
import { IncomingMessage } from 'http';
import { app, ipcMain } from 'electron';
import {
  ON_FULL_RESTART_APP,
  ON_SNAPSHOT_DATA_FAILURE,
  ON_SNAPSHOT_DATA_REQUEST,
  ON_SNAPSHOT_DATA_SUCCESS,
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_START_REQUEST,
  ON_SNAPSHOT_UNPACK_COMPLETE,
  ON_SNAPSHOT_UPDATE_PROGRESS,
  ON_SNAPSHOT_UNPACK_REQUEST,
  ON_NOT_ENOUGH_DISK_SPACE,
  ON_SNAPSHOT_DELETE_REQUEST,
} from '@defi_types/ipcEvents';
import { spawn } from 'child_process';
import { getDiskInfo } from 'node-disk-info';

export interface DefaultFileSizes {
  fileSizes: FileSizesModel;
  isSnapshotExisting: boolean;
  snapshotDirectory: string;
}

export const onSnapshotDataRequest = async (bw: Electron.BrowserWindow) => {
  await getLatestSnapshotBlock(bw);
  onDataRequest(bw);
};

export const initializeSnapshotEvents = async (bw: Electron.BrowserWindow) => {
  try {
    ipcMain.on(
      ON_SNAPSHOT_START_REQUEST,
      async (event: Electron.IpcMainEvent, snapshotUrl: string) => {
        downloadSnapshot(bw, snapshotUrl);
      }
    );

    ipcMain.on(ON_SNAPSHOT_DATA_REQUEST, async () => {
      await onSnapshotDataRequest(bw);
    });

    ipcMain.on(ON_FULL_RESTART_APP, () => {
      app.relaunch();
      app.exit();
    });

    ipcMain.on(
      ON_SNAPSHOT_UNPACK_REQUEST,
      async (event: Electron.IpcMainEvent, fileSizes: FileSizesModel) => {
        if (event) {
          onStartExtraction(bw, fileSizes);
        }
      }
    );

    ipcMain.on(
      ON_SNAPSHOT_DELETE_REQUEST,
      async (event: Electron.IpcMainEvent) => {
        if (event) {
          deleteSnapshotFiles();
          event.returnValue = true;
        }
      }
    );
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const onDataRequest = async (
  bw: Electron.BrowserWindow
): Promise<void> => {
  try {
    const { fileSizes } = await getDefaultFileSizes(bw);
    const hasSpace = await hasEnoughDiskSpace(fileSizes);
    if (!hasSpace) {
      return bw.webContents.send(ON_NOT_ENOUGH_DISK_SPACE);
    }
    bw.webContents.send(ON_SNAPSHOT_DATA_SUCCESS, fileSizes);
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DATA_FAILURE, error);
  }
};

export const hasEnoughDiskSpace = async (
  fileSizes: FileSizesModel
): Promise<boolean> => {
  const disks = await getDiskInfo();
  const available = (disks[0] != null && disks[0].available) || 0;
  log.info(
    `Available Space: ${available} - Remote Size: ${fileSizes.remoteSize}`
  );
  return true;
};

export const getDefaultFileSizes = async (
  bw: Electron.BrowserWindow
): Promise<DefaultFileSizes> => {
  const snapshotDirectory = createSnapshotDirectory(bw);
  const fileSizes: FileSizesModel = {
    remoteSize: 0,
    localSize: 0,
    completionRate: 0,
    downloadPath: snapshotDirectory,
    unpackModel: { completionRate: 0 },
    snapshotDate: new Date(),
    downloadUrl: `${SNAPSHOT_EU}${getSnapshotFilename()}`,
    filename: getSnapshotFilename(),
    block: SNAPSHOT_INFO.SNAPSHOT_BLOCK,
  };
  const isSnapshotExisting = await checkIfSnapshotExist(
    snapshotDirectory,
    fileSizes,
    bw
  );
  return { fileSizes, isSnapshotExisting, snapshotDirectory };
};

export const downloadSnapshot = async (
  bw: Electron.BrowserWindow,
  snapshotUrl: string
): Promise<boolean> => {
  try {
    return new Promise(async () => {
      const { fileSizes, isSnapshotExisting, snapshotDirectory } =
        await getDefaultFileSizes(bw);
      fileSizes.downloadUrl = snapshotUrl ?? fileSizes.downloadUrl;
      const hasSpace = await hasEnoughDiskSpace(fileSizes);
      if (!hasSpace) {
        return bw.webContents.send(ON_NOT_ENOUGH_DISK_SPACE);
      }

      if (isSnapshotExisting) {
        onDownloadComplete(bw, fileSizes, snapshotDirectory);
      } else {
        deleteSnapshotIfExisting(bw);
        startDownloadSnapshot(
          snapshotDirectory,
          bw,
          fileSizes,
          fileSizes.downloadUrl
        );
      }
    });
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const createSnapshotDirectory = (bw: Electron.BrowserWindow): string => {
  try {
    const snapshotPath = getSnapshotFolder();
    if (!checkPathExists(snapshotPath)) {
      fs.mkdirSync(snapshotPath, { recursive: true });
    }
    return path.join(snapshotPath, getSnapshotFilename());
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, error);
  }
};

export const getDirectorySize = (path: string) => {
  let size = 0;
  if (checkPathExists(path)) {
    size = fs.statSync(path).size;
  }
  return size;
};

export const checkIfSnapshotExist = async (
  directory: string,
  fileSizes: FileSizesModel,
  bw: Electron.BrowserWindow
): Promise<boolean> => {
  try {
    const response = await axios.head(fileSizes.downloadUrl);
    fileSizes.remoteSize =
      +response.headers['content-length'] || fileSizes.remoteSize;
    fileSizes.snapshotDate = response.headers['last-modified']
      ? new Date(response.headers['last-modified'])
      : fileSizes.snapshotDate;
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

export const deleteSnapshotIfExisting = (bw: Electron.BrowserWindow): void => {
  try {
    deleteSnapshotFiles();
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

export const onStartExtraction = (
  bw: Electron.BrowserWindow,
  fileSizes: FileSizesModel
) => {
  deleteSnapshotFolders();
  extractSnapshot(bw, fileSizes);
};

const updateFileSizes = (bytes: number, fileSizes: FileSizesModel) => {
  fileSizes.localSize = bytes || 0;
  fileSizes.completionRate =
    fileSizes.remoteSize > 0 ? bytes / fileSizes.remoteSize : 0;
};

export const startDownloadSnapshot = async (
  directory: string,
  bw: Electron.BrowserWindow,
  fileSizes: FileSizesModel,
  snapshotUrl: string
): Promise<any> => {
  try {
    let bytes = 0;
    const writer = createWriteStream(directory);
    const url = snapshotUrl;
    log.info(`Downloading snapshot from ${url}`);
    return https.get(url, (response: IncomingMessage) => {
      response.pipe(writer);
      let error: Error = null;
      let sendUpdate = false;
      const downloadInterval = setInterval(() => {
        sendUpdate = true;
      }, 30000);

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

export const extractSnapshot = (
  bw: Electron.BrowserWindow,
  fileSizes: FileSizesModel
) => {
  try {
    log.info('Starting extraction...');
    const blocksPath = BASE_FILE_PATH;
    const child = spawn(UNZIP_FILE_PATH, [
      `x`,
      `${fileSizes.downloadPath}`,
      `-o${blocksPath}`,
      `-aoa`,
    ]);

    child.stdout.on('data', (data) => {
      const t = data.toString('utf8').trim();
      log.info(t);
    });
    child.stderr.on('data', (data) => {
      const t = data.toString('utf8').trim();
      log.info(t);
      return bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, t);
    });
    child.on('close', (code) => {
      log.info(`${code}`);
      if (code === 0) {
        fileSizes.unpackModel = { completionRate: 1 };
        bw.webContents.send(ON_SNAPSHOT_UNPACK_COMPLETE, fileSizes);
      } else {
        bw.webContents.send(
          ON_SNAPSHOT_DOWNLOAD_FAILURE,
          'Extract closed unexpectedly.'
        );
      }
    });
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, 'Extract failure');
  }
};

export const getLatestSnapshotBlock = async (bw: Electron.BrowserWindow) => {
  try {
    const blocks = await axios.get<any>(`${SNAPSHOT_EU}${SNAPSHOT_INDEX}`);
    const data: string[] = blocks?.data?.split('\n') || [];
    const snapshots = data
      .filter((s) => s.includes('snapshot'))
      .map((s) => s.replace(/^\D+/g, '').replace('.zip', ''))
      .filter((s) => s != null && s != '')
      .sort((a, b) => +a - +b);
    SNAPSHOT_INFO.SNAPSHOT_BLOCK =
      snapshots[snapshots.length - 1] ?? SNAPSHOT_INFO.SNAPSHOT_BLOCK;
  } catch (error) {
    log.error(error);
    bw.webContents.send(ON_SNAPSHOT_DOWNLOAD_FAILURE, 'Snapshot block error');
  }
};
