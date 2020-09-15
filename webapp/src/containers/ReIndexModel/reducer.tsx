import { createSlice } from '@reduxjs/toolkit';
// TODO: Remove reducer from here
const configSlice = createSlice({
  name: 'reindexModal',
  initialState: {
    isReIndexModelOpen: false,
    isRestart: false,
  },
  reducers: {
    openReIndexModal(state) {
      state.isReIndexModelOpen = true;
    },
    closeReIndexModal(state) {
      state.isReIndexModelOpen = false;
    },
    isRestartLoader(state) {
      state.isRestart = true;
    },
    closeRestartLoader(state) {
      state.isRestart = false;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  openReIndexModal,
  closeReIndexModal,
  isRestartLoader,
  closeRestartLoader,
} = actions;

export default reducer;
