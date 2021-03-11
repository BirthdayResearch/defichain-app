import { takeLatest, call, put, delay } from 'redux-saga/effects';

import showNotification from '../../utils/notifications';
import { getErrorMessage } from '../../utils/utility';
import {
  backupLoadingStart,
  backupWalletStart,
  closeBackupWalletWarningModal,
  closeEncryptWalletModal,
  closeWalletPassphraseModal,
  encryptWalletStart,
  showUpdateAvailable,
  restartWalletStart,
  openWalletRestartModal,
  restartModal,
  setIsWalletReplace,
  closeResetWalletDatModal,
  startResetWalletDatRequest,
  setIsQueueResetRoute,
  restoreWalletViaRecent,
  openRestoreWalletModal,
  encryptWalletSuccess,
  encryptWalletFailure,
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
import { replaceWalletDat } from '../../app/service';
import { backupWallet } from '../../app/update.ipcRenderer';
import { restartNode } from '../../utils/isElectron';
import { shutDownBinary } from '../../worker/queue';
import {
  fetchWalletTokenTransactionsListResetRequest,
  lockWalletStart,
  restoreWalletViaBackupFailure,
  setIsWalletCreatedRequest,
  setLockedUntil,
  setWalletEncrypted,
  unlockWalletFailure,
  unlockWalletStart,
  unlockWalletSuccess,
} from '../WalletPage/reducer';
import { checkRestoreRecentIfExisting } from '../WalletPage/service';
import { history } from '../../utils/history';
import { openPostEncryptBackupModal } from './reducer';

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
  const {
    payload: { passphrase, isModal, pageRedirect },
  } = action;
  try {
    yield call(handleEncryptWallet, passphrase);
    yield put(encryptWalletSuccess());
    yield put(setWalletEncrypted(true));
    yield put(unlockWalletSuccess(false));
    showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.encryptWalletSuccess')
    );
    if (isModal) {
      yield put(closeEncryptWalletModal());
      yield delay(1000);
    } else {
      history.push(pageRedirect);
    }
    yield put(openPostEncryptBackupModal(true));
  } catch (e) {
    log.error(e);
    const message = getErrorMessage(e);
    yield put(encryptWalletFailure(message));
    if (isModal) {
      showErrorNotification({ message });
    }
  }
}

function* unlockWallet(action) {
  const {
    payload: { passphrase, isModal, pageRedirect, timeout },
  } = action;
  try {
    yield call(handleUnlockWallet, passphrase, timeout);
    yield put(unlockWalletSuccess(true));
    yield call(enableAutoLock, timeout);
    showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.unlockWalletSuccess')
    );
    if (isModal) {
      yield put(closeWalletPassphraseModal());
    } else {
      history.push(pageRedirect);
    }
  } catch (e) {
    log.error(e, 'unlockWallet');
    const message = getErrorMessage(e);
    yield put(unlockWalletFailure(message));
  }
}

function* setAutoLock(action) {
  const timeout = action.payload;
  try {
    yield call(enableAutoLock, timeout);
  } catch (e) {
    const message = getErrorMessage(e);
    log.error(message, 'setAutoLock');
  }
}

function* lockWallet() {
  try {
    yield call(handleLockWallet);
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
  yield call(restartAndReplaceWallet);
  yield put(setIsWalletReplace());
}

function* startResetWalletDat() {
  yield call(restartAndReplaceWallet);
  yield put(setIsWalletCreatedRequest(false));
  yield put(closeResetWalletDatModal());
  yield call(fetchWalletTokenTransactionsListResetRequest);
}

function* restartAndReplaceWallet() {
  yield put(restartModal());
  yield call(replaceWalletDat);
  yield call(shutDownBinary);
  yield call(restartNode);
  yield put(setIsQueueResetRoute(true));
}

function* startRestoreWalletChecks(action) {
  try {
    const path = action.payload;
    const resp = yield call(checkRestoreRecentIfExisting, path);
    if (resp.success) {
      yield put(openRestoreWalletModal({ isOpen: true, filePath: path }));
    } else {
      yield put({
        type: restoreWalletViaBackupFailure.type,
        payload: resp.message,
      });
    }
  } catch (error) {
    log.error(error, 'startRestoreWalletChecks');
    yield put({
      type: restoreWalletViaBackupFailure.type,
      payload: error.message,
    });
  }
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
  yield takeLatest(startResetWalletDatRequest.type, startResetWalletDat);
  yield takeLatest(restoreWalletViaRecent.type, startRestoreWalletChecks);
  yield takeLatest(setLockedUntil.type, setAutoLock);
}
export default mySaga;
