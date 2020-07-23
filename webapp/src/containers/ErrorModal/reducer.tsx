import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'errorModal',
  initialState: {
    isOpen: false,
    isRestart: false,
  },
  reducers: {
    openErrorModal(state) {
      state.isOpen = true;
    },
    closeErrorModal(state) {
      state.isOpen = false;
      state.isRestart = false;
    },
    restartModal(state) {
      state.isRestart = true;
    },
  },
});

const { actions, reducer } = configSlice;

export const { openErrorModal, closeErrorModal, restartModal } = actions;

export default reducer;
