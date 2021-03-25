import {
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_UPDATE_PROGRESS,
} from '@defi_types/ipcEvents';
import { ipcRendererFunc } from '../utils/isElectron';
import * as log from '../utils/electronLogger';
import store from './rootStore';
import { updateDownloadSnapshotData } from '../containers/PopOver/reducer';

const initSnapshotRenderers = () => {
  const ipcRenderer = ipcRendererFunc();

  ipcRenderer.on(ON_SNAPSHOT_UPDATE_PROGRESS, async (event: any, args: any) => {
    store.dispatch(updateDownloadSnapshotData(args));
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
      store.dispatch(updateDownloadSnapshotData(args));
      log.info(`Download Complete!`);
      log.info(args);
    }
  );
};

export default initSnapshotRenderers;
