import reducer, {
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
  openWalletDatBackupModal,
  closeWalletDatBackupModal,
  initialState,
} from '../reducer';

const errorMessage = 'Error Occurred';

describe('Popover reducer', () => {
  const nextState = initialState;
  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('Error/Restart modal', () => {
    it('should check for openErrorModal', () => {
      const nextState = reducer(initialState, openErrorModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.isOpen).toBeTruthy();
      expect(rootState.popover.showWarning).toBeTruthy();
    });

    it('should check for closeErrorModal', () => {
      const nextState = reducer(initialState, closeErrorModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.isOpen).toBeFalsy();
      expect(rootState.popover.showWarning).toBeFalsy();
      expect(rootState.popover.isRestart).toBeFalsy();
    });

    it('should check for restartModal', () => {
      const nextState = reducer(initialState, restartModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.isRestart).toBeTruthy();
      expect(rootState.popover.isOpen).toBeTruthy();
    });
  });

  describe('Update Modal', () => {
    it('should check for startUpdateApp', () => {
      const nextState = reducer(initialState, startUpdateApp());
      const rootState = { popover: nextState };
      expect(rootState.popover.isUpdateModalOpen).toBeTruthy();
    });

    it('should check for showUpdateAvailable', () => {
      const nextState = reducer(initialState, showUpdateAvailable());
      const rootState = { popover: nextState };
      expect(rootState.popover.showUpdateAvailable).toBeTruthy();
    });

    it('should check for updateApp', () => {
      const payload = {
        percent: 30,
      };
      const nextState = reducer(initialState, updateApp(payload));
      const rootState = { popover: nextState };
      expect(rootState.popover.isUpdateStarted).toBeTruthy();
      expect(rootState.popover.updateAppInfo).toEqual(payload);
    });

    it('should check for updateCompleted', () => {
      const nextState = reducer(initialState, updateCompleted());
      const rootState = { popover: nextState };
      expect(rootState.popover.isUpdateStarted).toBeFalsy();
      expect(rootState.popover.updateAppInfo).toEqual({});
      expect(rootState.popover.postUpdateFlag).toBeTruthy();
    });

    it('should check for updateError', () => {
      const nextState = reducer(initialState, updateError(errorMessage));
      const rootState = { popover: nextState };
      expect(rootState.popover.showUpdateAvailable).toBeFalsy();
      expect(rootState.popover.postUpdateFlag).toBeFalsy();
      expect(rootState.popover.updateAppInfo).toEqual({});
      expect(rootState.popover.isUpdateError).toEqual(errorMessage);
    });

    it('should check for closeUpdateAvailable', () => {
      const nextState = reducer(initialState, closeUpdateAvailable());
      const rootState = { popover: nextState };
      expect(rootState.popover.showUpdateAvailable).toBeFalsy();
    });

    it('should check for closePostUpdate', () => {
      const nextState = reducer(initialState, closePostUpdate());
      const rootState = { popover: nextState };
      expect(rootState.popover.postUpdateFlag).toBeFalsy();
    });

    it('should check for closeUpdateApp', () => {
      const nextState = reducer(initialState, closeUpdateApp());
      const rootState = { popover: nextState };
      expect(rootState.popover.isUpdateModalOpen).toBeFalsy();
      expect(rootState.popover.isUpdateError).toEqual('');
    });

    it('should check for minimizeDownloadProgressModal', () => {
      const nextState = reducer(initialState, minimizeDownloadProgressModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.isMinimized).toBeTruthy();
      expect(rootState.popover.isUpdateModalOpen).toBeFalsy();
      expect(rootState.popover.updateAvailableBadge).toBeFalsy();
    });

    it('should check for showUpdateAvailableBadge', () => {
      const nextState = reducer(initialState, showUpdateAvailableBadge());
      const rootState = { popover: nextState };
      expect(rootState.popover.updateAvailableBadge).toBeTruthy();
    });

    it('should check for openBackupWallet', () => {
      const nextState = reducer(initialState, openBackupWallet());
      const rootState = { popover: nextState };
      expect(rootState.popover.backupWalletIsOpen).toBeTruthy();
    });

    it('should check for closeBackupLoading', () => {
      const nextState = reducer(initialState, closeBackupLoading());
      const rootState = { popover: nextState };
      expect(rootState.popover.backupWalletIsOpen).toBeFalsy();
    });
  });

  describe('WalletDatBackupModal', () => {
    it('should check for openWalletDatBackupModal', () => {
      const nextState = reducer(initialState, openWalletDatBackupModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.openBackupWalletDatModal).toBeTruthy();
    });

    it('should check for closeWalletDatBackupModal', () => {
      const nextState = reducer(initialState, closeWalletDatBackupModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.openBackupWalletDatModal).toBeFalsy();
    });
  });

  describe('ReIndexModal', () => {
    it('should check for openReIndexModal', () => {
      const nextState = reducer(initialState, openReIndexModal(''));
      const rootState = { popover: nextState };
      expect(rootState.popover.isReIndexModelOpen).toBeTruthy();
    });

    it('should check for closeReIndexModal', () => {
      const nextState = reducer(initialState, closeReIndexModal());
      const rootState = { popover: nextState };
      expect(rootState.popover.isReIndexModelOpen).toBeFalsy();
    });

    it('should check for isRestartLoader', () => {
      const nextState = reducer(initialState, isRestartLoader());
      const rootState = { popover: nextState };
      expect(rootState.popover.isReIndexRestart).toBeTruthy();
    });
  });
});
