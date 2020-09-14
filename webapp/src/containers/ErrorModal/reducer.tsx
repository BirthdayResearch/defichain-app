import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'errorModal',
  initialState: {
    isOpen: false,
    isRestart: false,
    showWarning: false,
    isUpdateModalOpen: false,
    isUpdateStarted: false,
    isUpdateError: '',
    updateAppinfo: {},
    postUpdateFlag: false,
    showUpdateAvailable: false,
  },
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
      state.updateAppinfo = action.payload;
    },
    updateCompleted(state) {
      state.isUpdateStarted = false;
      state.updateAppinfo = {};
      state.postUpdateFlag = true;
    },
    updateError(state, action) {
      state.showUpdateAvailable = false;
      state.updateAppinfo = {};
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
} = actions;

export default reducer;
