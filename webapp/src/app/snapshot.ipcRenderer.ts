import {
  ON_SNAPSHOT_DOWNLOAD_COMPLETE,
  ON_SNAPSHOT_DOWNLOAD_FAILURE,
  ON_SNAPSHOT_UPDATE_PROGRESS,
  ON_SNAPSHOT_UNPACK_PROGRESS,
  ON_SNAPSHOT_UNPACK_COMPLETE,
  ON_SNAPSHOT_DATA_SUCCESS,
  ON_SNAPSHOT_DATA_FAILURE,
  ON_SNAPSHOT_UNPACK_REQUEST,
  ON_NOT_ENOUGH_DISK_SPACE,
  ON_SNAPSHOT_DELETE_REQUEST,
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
import { shutDownNode } from '../worker/queue';
import { stopNode } from './service';
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
        await shutDownNode();
        await stopNode();
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

  ipcRenderer.on(ON_NOT_ENOUGH_DISK_SPACE, async (event: any) => {
    const errMessage = I18n.t('alerts.notEnoughDiskSpace');
    log.error(errMessage);
    showNotification(I18n.t('alerts.errorOccurred'), errMessage);
    store.dispatch(openDownloadSnapshotModal(false));
  });
};

export const onSnapshotDataSuccess = (args: FileSizesModel): void => {
  store.dispatch(updateDownloadSnapshotData(args));
  store.dispatch(
    updateDownloadSnapshotStep(DownloadSnapshotSteps.SnapshotRequest)
  );
  store.dispatch(openDownloadSnapshotModal(true));
};

export const onSnapshotDeleteRequest = (): void => {
  const ipcRenderer = ipcRendererFunc();
  ipcRenderer.sendSync(ON_SNAPSHOT_DELETE_REQUEST, {});
};

export default initSnapshotRenderers;
