import { isElectron } from '../utils/isElectron';
import initMenuIpcRenderers from './menu.ipcRenderer';
import initUpdateIpcRenderers from './update.ipcRenderer';
import initSnapshotRenderers from './snapshot.ipcRenderer';

function* startUpSaga() {
  if (isElectron()) {
    initMenuIpcRenderers();
    initUpdateIpcRenderers();
    initSnapshotRenderers();
  }
}

export default startUpSaga;
