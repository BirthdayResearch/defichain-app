import { takeLatest, call, put } from 'redux-saga/effects';
import { backupWallet } from '../../app/update.ipcRenderer';
import { backupLoadingStart, showUpdateAvailable } from './reducer';

function* backupWalletbeforeUpdate() {
  yield call(backupWallet);
  yield put(showUpdateAvailable());
}

function* mySaga() {
  yield takeLatest(backupLoadingStart.type, backupWalletbeforeUpdate);
}
export default mySaga;
