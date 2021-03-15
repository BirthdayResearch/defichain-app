import {
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_START_REQUEST,
  ON_SNAPSHOT_UPDATE_PROGRESS,
} from '@defi_types/ipcEvents';
import { ipcRendererFunc, isElectron } from '../utils/isElectron';
import * as log from '../utils/electronLogger';

const initSnapshotRenderers = () => {
  const ipcRenderer = ipcRendererFunc();

  ipcRenderer.on(ON_SNAPSHOT_UPDATE_PROGRESS, async (event: any, args: any) => {
    log.info(`Downloading: ${args}`);
  });

  ipcRenderer.on(
    ON_SNAPSHOT_DOWNLOAD_FAILURE,
    async (event: any, args: any) => {
      log.error(args);
    }
  );

  ipcRenderer.on(
    ON_SNAPSHOT_DOWNLOAD_COMPLETE,
    async (event: any, args: any) => {
      log.info(`Download Complete!`);
      log.info(args);
    }
  );
};

export default initSnapshotRenderers;
