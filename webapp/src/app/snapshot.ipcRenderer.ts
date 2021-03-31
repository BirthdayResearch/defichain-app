import {
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_UPDATE_PROGRESS,
  ON_SNAPSHOT_UNPACK_PROGRESS,
  ON_SNAPSHOT_UNPACK_COMPLETE,
  ON_SNAPSHOT_DATA_SUCCESS,
  ON_SNAPSHOT_DATA_FAILURE,
  ON_SNAPSHOT_UNPACK_REQUEST,
} from '@defi_types/ipcEvents';
import { ipcRendererFunc } from '../utils/isElectron';
import * as log from '../utils/electronLogger';
import store from './rootStore';
import {
  openDownloadSnapshotModal,
  updateDownloadSnapshotData,
  updateDownloadSnapshotStep,
} from '../containers/PopOver/reducer';
import { DownloadSnapshotSteps } from '../containers/PopOver/types';
import { shutDownBinary } from '../worker/queue';
import { stopBinary } from './service';
import showNotification from '../utils/notifications';
import { I18n } from 'react-redux-i18n';
import { FileSizesModel } from '@defi_types/snapshot';

const initSnapshotRenderers = () => {
  const ipcRenderer = ipcRendererFunc();

  ipcRenderer.on(ON_SNAPSHOT_UPDATE_PROGRESS, async (event: any, args: any) => {
    store.dispatch(updateDownloadSnapshotData(args));
  });

  ipcRenderer.on(
    ON_SNAPSHOT_DOWNLOAD_FAILURE,
    async (event: any, args: any) => {
      log.error(args);
      store.dispatch(openDownloadSnapshotModal(false));
      showNotification(
        I18n.t('alerts.errorOccurred'),
        args ? JSON.stringify(args) : ''
      );
    }
  );

  ipcRenderer.on(
    ON_SNAPSHOT_DOWNLOAD_COMPLETE,
    async (event: any, args: any) => {
      store.dispatch(updateDownloadSnapshotData(args));
      store.dispatch(
        updateDownloadSnapshotStep(DownloadSnapshotSteps.ApplyingSnapshot)
      );
      log.info(`Snapshot download complete!`);
      const {
        app: { isRunning },
      } = store.getState();
      if (isRunning) {
        await shutDownBinary();
        await stopBinary();
      }
      ipcRenderer.send(ON_SNAPSHOT_UNPACK_REQUEST, args);
    }
  );

  ipcRenderer.on(ON_SNAPSHOT_UNPACK_PROGRESS, async (event: any, args: any) => {
    store.dispatch(updateDownloadSnapshotData(args));
  });

  ipcRenderer.on(ON_SNAPSHOT_UNPACK_COMPLETE, async (event: any, args: any) => {
    store.dispatch(updateDownloadSnapshotData(args));
    store.dispatch(
      updateDownloadSnapshotStep(DownloadSnapshotSteps.SnapshotApplied)
    );
    log.info(`Snapshot unpack complete!`);
  });

  ipcRenderer.on(ON_SNAPSHOT_DATA_FAILURE, async (event: any, args: any) => {
    log.error(args);
  });

  ipcRenderer.on(ON_SNAPSHOT_DATA_SUCCESS, async (event: any, args: any) => {
    onSnapshotDataSuccess(args);
  });
};

export const onSnapshotDataSuccess = (args: FileSizesModel): void => {
  store.dispatch(updateDownloadSnapshotData(args));
  store.dispatch(
    updateDownloadSnapshotStep(DownloadSnapshotSteps.SnapshotRequest)
  );
  store.dispatch(openDownloadSnapshotModal(true));
};

export default initSnapshotRenderers;
