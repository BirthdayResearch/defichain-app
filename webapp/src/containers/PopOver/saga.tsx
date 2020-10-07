import { takeLatest, call, put } from 'redux-saga/effects';
import { backupWallet } from '../../app/update.ipcRenderer';
import { backupLoadingStart, showUpdateAvailable } from './reducer';

export function* backupWalletbeforeUpdate() {
  const result = yield call(backupWallet);
  if (result) {
    yield put(showUpdateAvailable());
  }
}

function* mySaga() {
  yield takeLatest(backupLoadingStart.type, backupWalletbeforeUpdate);
}
export default mySaga;
