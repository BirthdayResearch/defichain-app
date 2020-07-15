import { isElectron } from '../utils/isElectron';
import initMenuIpcRenderers from './menu.ipcRenderer';

function* startUpSaga() {
  if (isElectron()) {
    initMenuIpcRenderers();
  }
}

export default startUpSaga;
