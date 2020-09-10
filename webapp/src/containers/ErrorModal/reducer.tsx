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
    updateApp(state, action) {
      state.isUpdateStarted = true;
      state.updateAppinfo = action.payload;
    },
    updateCompleted(state) {
      state.isUpdateStarted = false;
      state.postUpdateFlag = true;
    },
    closeUpdate(state, action) {
      state.isUpdateStarted = false;
      state.updateAppinfo = {};
      state.postUpdateFlag = false;
      state.isUpdateError = action.payload || '';
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
  closeUpdate,
} = actions;

export default reducer;
