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
  isBackupWalletWarningModelOpen: false,
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
} = actions;

export default reducer;
