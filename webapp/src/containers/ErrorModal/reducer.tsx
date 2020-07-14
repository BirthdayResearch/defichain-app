import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'errorModal',
  initialState: {
    isOpen: false,
  },
  reducers: {
    openErrorModal(state) {
      state.isOpen = true;
    },
    closeErrorModal(state) {
      state.isOpen = false;
    },
  },
});

const { actions, reducer } = configSlice;

export const { openErrorModal, closeErrorModal } = actions;

export default reducer;
