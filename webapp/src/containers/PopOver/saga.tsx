import { takeLatest, call, put } from 'redux-saga/effects';

import showNotification from '../../utils/notifications';
import { getErrorMessage, getNetworkType } from '../../utils/utility';
import {
  backupLoadingStart,
  backupWalletStart,
  closeBackupWalletWarningModal,
  closeEncryptWalletModal,
  closeWalletPassphraseModal,
  encryptWalletStart,
  lockWalletStart,
  showUpdateAvailable,
  unlockWalletStart,
  restartWalletStart,
  openWalletRestartModal,
  restartModal,
  setIsWalletReplace,
} from './reducer';
import {
  autoLockTimer,
  enableAutoLock,
  handleEncryptWallet,
  handleLockWallet,
  handleUnlockWallet,
} from './service';
import * as log from '../../utils/electronLogger';
import { I18n } from 'react-redux-i18n';
import { showErrorNotification } from '../../app/service';
import PersistentStore from '../../utils/persistentStore';
import {
  IS_WALLET_LOCKED_MAIN,
  IS_WALLET_LOCKED_TEST,
  MAIN,
} from '../../constants';
import { replaceWalletDat } from '../../app/service';
import { backupWallet } from '../../app/update.ipcRenderer';
import { restartNode } from '../../utils/isElectron';
import { shutDownBinary } from '../../worker/queue';

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

function* encryptWallet(action) {
  try {
    const {
      payload: { passphrase },
    } = action;
    const result = yield call(handleEncryptWallet, passphrase);
    yield put(closeEncryptWalletModal());

    const networkType = getNetworkType();
    const isWalletLocked =
      networkType === MAIN ? IS_WALLET_LOCKED_MAIN : IS_WALLET_LOCKED_TEST;
    PersistentStore.set(isWalletLocked, true);
    showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.encryptWalletSuccess')
    );
  } catch (e) {
    log.error(e);
    const message = getErrorMessage(e);
    yield put(closeEncryptWalletModal());
    showErrorNotification({ message });
  }
}

function* unlockWallet(action) {
  try {
    const {
      payload: { passphrase },
    } = action;
    const result = yield call(handleUnlockWallet, passphrase);
    yield call(enableAutoLock);
    yield put(closeWalletPassphraseModal());
    showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.unlockWalletSuccess')
    );
  } catch (e) {
    log.error(e);
    const message = getErrorMessage(e);
    yield put(closeWalletPassphraseModal());
    showErrorNotification({ message });
  }
}

function* lockWallet() {
  try {
    const result = yield call(handleLockWallet);
    autoLockTimer && clearTimeout(autoLockTimer);
    showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.lockWalletSuccess')
    );
  } catch (e) {
    log.error(e);
    const message = getErrorMessage(e);
    showErrorNotification({ message });
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
  yield takeLatest(encryptWalletStart.type, encryptWallet);
  yield takeLatest(unlockWalletStart.type, unlockWallet);
  yield takeLatest(lockWalletStart.type, lockWallet);
  yield takeLatest(
    restartWalletStart.type,
    restartWalletBeforeNewWalletCreation
  );
}
export default mySaga;
