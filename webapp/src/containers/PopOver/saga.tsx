import { takeLatest, call, put } from 'redux-saga/effects';
import { backupWallet } from '../../app/update.ipcRenderer';
import { backupLoadingStart, backupWalletStart, closeBackupWalletWarningModal, showUpdateAvailable } from './reducer';

export function* backupWalletbeforeUpdate() {
  const result = yield call(backupWallet);
  if (result) {
    yield put(showUpdateAvailable());
  }
}

function* backupWalletBeforeNewWalletCreation() {
  const result = yield call(backupWallet);
  if(result){
    yield put(closeBackupWalletWarningModal());
  }
}

function* mySaga() {
  yield takeLatest(backupLoadingStart.type, backupWalletbeforeUpdate);
  yield takeLatest(backupWalletStart.type, backupWalletBeforeNewWalletCreation);
}
export default mySaga;
