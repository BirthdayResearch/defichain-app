import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isOpen: false,
  isRestart: false,
  showWarning: false,
  isUpdateModalOpen: false,
  isUpdateStarted: false,
  isUpdateError: '',
  updateAppInfo: {},
  postUpdateFlag: false,
  showUpdateAvailable: false,
  isReIndexModelOpen: false,
  isReIndexRestart: false,
  isMinimized: false,
  updateAvailableBadge: false,
  backupWalletIsOpen: false,
  openBackupWalletDatModal: false,
  openResetWalletDatModal: false,
  isBackupWalletWarningModelOpen: false,
  isEncryptWalletModalOpen: false,
  isWalletPassphraseModalOpen: false,
  isWalletUnlocked: false,
  isWalletRestart: false,
  isWalletReplace: false,
  isGeneralReindexModalOpen: false,
  isQueueResetRoute: false,
  isRestoreWalletOpen: false,
  filePath: '',
  isExitWalletOpen: false,
  isWalletEncrypting: false,
  isErrorEncryptingWallet: '',
  isEncryptFromModal: false,
};

const configSlice = createSlice({
  name: 'popover',
  initialState,
  reducers: {
    openErrorModal(state) {
      state.isOpen = true;
      state.showWarning = true;
    },
    closeErrorModal(state) {
      state.isOpen = false;
      state.isRestart = false;
      state.showWarning = false;
    },
    restartModal(state) {
      state.isRestart = true;
      state.isOpen = true;
    },
    startUpdateApp(state) {
      state.isUpdateModalOpen = true;
    },
    showUpdateAvailable(state) {
      state.showUpdateAvailable = true;
    },
    updateApp(state, action) {
      state.isUpdateStarted = true;
      state.updateAppInfo = action.payload;
    },
    updateCompleted(state) {
      state.isUpdateStarted = false;
      state.updateAppInfo = {};
      state.postUpdateFlag = true;
    },
    updateError(state, action) {
      state.showUpdateAvailable = false;
      state.updateAppInfo = {};
      state.postUpdateFlag = false;
      state.isUpdateError = action.payload;
    },
    closeUpdateAvailable(state) {
      state.showUpdateAvailable = false;
    },
    closePostUpdate(state) {
      state.postUpdateFlag = false;
    },
    closeUpdateApp(state) {
      state.isUpdateModalOpen = false;
      state.isUpdateError = '';
    },
    openReIndexModal(state) {
      state.isReIndexModelOpen = true;
    },
    closeReIndexModal(state) {
      state.isReIndexModelOpen = false;
    },
    isRestartLoader(state) {
      state.isReIndexRestart = true;
    },
    closeRestartLoader(state) {
      state.isReIndexRestart = false;
    },
    minimizeDownloadProgressModal(state) {
      state.isMinimized = true;
      state.isUpdateModalOpen = false;
      state.updateAvailableBadge = false;
    },
    showUpdateAvailableBadge(state) {
      state.updateAvailableBadge = true;
    },
    openBackupWallet(state) {
      state.backupWalletIsOpen = true;
    },
    backupLoadingStart() {},
    closeBackupLoading(state) {
      state.backupWalletIsOpen = false;
    },
    openBackupWalletWarningModal(state) {
      state.isBackupWalletWarningModelOpen = true;
    },
    closeBackupWalletWarningModal(state) {
      state.isBackupWalletWarningModelOpen = false;
    },
    backupWalletStart() {},
    openWalletDatBackupModal(state) {
      state.openBackupWalletDatModal = true;
    },
    closeWalletDatBackupModal(state) {
      state.openBackupWalletDatModal = false;
    },
    openEncryptWalletModal(state) {
      state.isEncryptWalletModalOpen = true;
    },
    closeEncryptWalletModal(state) {
      state.isEncryptWalletModalOpen = false;
    },
    encryptWalletStart(state, action) {
      state.isWalletEncrypting = true;
      state.isEncryptFromModal = action.payload.isModal;
    },
    encryptWalletSuccess(state) {
      state.isWalletEncrypting = false;
      state.isErrorEncryptingWallet = '';
    },
    encryptWalletFailure(state, action) {
      state.isWalletEncrypting = false;
      state.isErrorEncryptingWallet = action.payload;
    },
    openWalletPassphraseModal(state) {
      state.isWalletPassphraseModalOpen = true;
    },
    closeWalletPassphraseModal(state) {
      state.isWalletPassphraseModalOpen = false;
    },
    unlockWalletStart(state, action) {
      state.isWalletUnlocked = true;
    },
    lockWalletStart(state, action) {
      state.isWalletUnlocked = false;
    },
    enableAutoLockStart(state) {
      state.isWalletUnlocked = false;
    },
    openWalletRestartModal(state) {
      state.isWalletRestart = true;
    },
    closeWalletRestartModal(state) {
      state.isWalletRestart = false;
    },
    restartWalletStart(state) {
      state.isWalletReplace = true;
      state.isWalletRestart = false;
    },
    setIsWalletReplace(state) {
      state.isWalletReplace = true;
    },
    openResetWalletDatModal(state) {
      state.openResetWalletDatModal = true;
    },
    startResetWalletDatRequest(state) {},
    closeResetWalletDatModal(state) {
      state.openResetWalletDatModal = false;
    },
    openGeneralReIndexModal(state) {
      state.isGeneralReindexModalOpen = true;
    },
    closeGeneralReIndexModal(state) {
      state.isGeneralReindexModalOpen = false;
    },
    setIsQueueResetRoute(state, action) {
      state.isQueueResetRoute = action.payload;
    },
    openRestoreWalletModal(state, action) {
      state.isRestoreWalletOpen = action.payload.isOpen;
      state.filePath = action.payload.filePath;
    },
    restoreWalletViaRecent(state) {},
    openExitWalletModal(state, action) {
      state.isExitWalletOpen = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  openErrorModal,
  closeErrorModal,
  restartModal,
  startUpdateApp,
  updateApp,
  updateCompleted,
  updateError,
  showUpdateAvailable,
  closeUpdateAvailable,
  closePostUpdate,
  closeUpdateApp,
  openReIndexModal,
  closeReIndexModal,
  isRestartLoader,
  closeRestartLoader,
  minimizeDownloadProgressModal,
  showUpdateAvailableBadge,
  backupLoadingStart,
  openBackupWallet,
  closeBackupLoading,
  openBackupWalletWarningModal,
  closeBackupWalletWarningModal,
  backupWalletStart,
  openWalletDatBackupModal,
  closeWalletDatBackupModal,
  openEncryptWalletModal,
  closeEncryptWalletModal,
  encryptWalletStart,
  encryptWalletSuccess,
  encryptWalletFailure,
  openWalletPassphraseModal,
  closeWalletPassphraseModal,
  unlockWalletStart,
  lockWalletStart,
  enableAutoLockStart,
  openWalletRestartModal,
  closeWalletRestartModal,
  restartWalletStart,
  setIsWalletReplace,
  openResetWalletDatModal,
  closeResetWalletDatModal,
  startResetWalletDatRequest,
  openGeneralReIndexModal,
  closeGeneralReIndexModal,
  setIsQueueResetRoute,
  openRestoreWalletModal,
  restoreWalletViaRecent,
  openExitWalletModal,
} = actions;

export default reducer;
