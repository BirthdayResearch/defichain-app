import fs, { createWriteStream } from 'fs';
import * as log from '../services/electronLogger';
import { checkPathExists, getBaseFolder } from '../utils';
import path from 'path';
import { SNAPSHOT_FOLDER } from '../constants';
import axios from 'axios';
import { OFFICIAL_SNAPSHOT_URL, SNAPSHOT_FILENAME } from '@defi_types/snapshot';
import { rejects } from 'node:assert';

export const downloadSnapshot = async (): Promise<boolean> => {
  try {
    return new Promise(async (resolve, reject) => {
      const snapshotDirectory = createSnapshotDirectory();
      const isSnapshotExisting = await checkIfSnapshotExist(snapshotDirectory);
      if (isSnapshotExisting) {
        resolve(true);
      } else {
        startDownloadSnapshot(snapshotDirectory);
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
  directory: string
): Promise<boolean> => {
  try {
    if (checkPathExists(directory)) {
      const response = await axios.head(OFFICIAL_SNAPSHOT_URL);
      const remoteSize = +response.headers['content-length'];
      const localSize = fs.statSync(directory).size;
      log.info(`Remote Size: ${remoteSize}`);
      log.info(`Local Size: ${localSize}`);
      return remoteSize === localSize;
    } else {
      return false;
    }
  } catch (error) {
    log.error(error);
  }
};

export const onDownloadProgress = (progressEvent: any) => {
  try {
    log.info(progressEvent);
  } catch (error) {}
};

export const startDownloadSnapshot = async (
  directory: string
): Promise<any> => {
  try {
    const writer = createWriteStream(directory);
    return axios
      .get(OFFICIAL_SNAPSHOT_URL, {
        responseType: 'stream',
        onDownloadProgress: onDownloadProgress,
      })
      .then((response) => {
        return new Promise((resolve, reject) => {
          response.data.pipe(writer);
          let error: Error = null;
          writer.on('error', (err: Error) => {
            error = err;
            writer.close();
            reject(err);
          });
          writer.on('close', () => {
            if (!error) {
              resolve(true);
            }
          });
        });
      })
      .catch(
        (err) =>
          new Promise((resolve, reject) => {
            log.error(err);
            reject(err);
          })
      );
  } catch (error) {
    log.error(error);
    return false;
  }
};
