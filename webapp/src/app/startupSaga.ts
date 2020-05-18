import isElectron from 'is-electron';
import initMenuIpcRenderers from './menu.ipcRenderer';

function* startUpSaga() {
  if (isElectron()) {
    initMenuIpcRenderers();
  }
}

export default startUpSaga;
