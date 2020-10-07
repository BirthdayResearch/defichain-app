import { isElectron } from '../utils/isElectron';
import initMenuIpcRenderers from './menu.ipcRenderer';
import initUpdateIpcRenderers from './update.ipcRenderer';

function* startUpSaga() {
  if (isElectron()) {
    initMenuIpcRenderers();
    initUpdateIpcRenderers();
  }
}

export default startUpSaga;
