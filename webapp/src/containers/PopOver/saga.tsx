import { takeLatest, call, put } from 'redux-saga/effects';
import { replaceWalletDat } from '../../app/service';
import { backupWallet } from '../../app/update.ipcRenderer';
import { restartNode } from '../../utils/isElectron';
import { shutDownBinary } from '../../worker/queue';
import {
  backupLoadingStart,
  backupWalletStart,
  closeBackupWalletWarningModal,
  showUpdateAvailable,
  restartWalletStart,
  openWalletRestartModal, restartModal, setIsWalletReplace
} from './reducer';

export function* backupWalletbeforeUpdate() {
  const result = yield call(backupWallet);
  if (result) {
    yield put(showUpdateAvailable());
  }
}

function* backupWalletBeforeNewWalletCreation() {
  const result = yield call(backupWallet);
  if (result) {
    yield put(closeBackupWalletWarningModal());
    yield put(openWalletRestartModal());
  }
}

function* restartWalletBeforeNewWalletCreation() {
  yield put(restartModal());
  yield call(replaceWalletDat);
  yield call(shutDownBinary);
  yield call(restartNode);
  yield put(setIsWalletReplace());
}

function* mySaga() {
  yield takeLatest(backupLoadingStart.type, backupWalletbeforeUpdate);
  yield takeLatest(backupWalletStart.type, backupWalletBeforeNewWalletCreation);
  yield takeLatest(
    restartWalletStart.type,
    restartWalletBeforeNewWalletCreation
  );
}
export default mySaga;
