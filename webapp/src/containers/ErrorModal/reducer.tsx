import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'errorModal',
  initialState: {
    isOpen: false,
    isRestart: false,
    showWarning: false,
    isReIndexModelOpen: false,
    isReIndexRestart: false,
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
  },
});

const { actions, reducer } = configSlice;

export const {
  openErrorModal,
  closeErrorModal,
  restartModal,
  openReIndexModal,
  closeReIndexModal,
  isRestartLoader,
  closeRestartLoader,
} = actions;

export default reducer;
