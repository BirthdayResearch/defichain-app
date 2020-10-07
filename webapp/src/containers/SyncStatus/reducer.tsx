import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'syncstatus',
  initialState: {
    isLoading: false,
    syncedPercentage: 0,
    latestBlock: 0,
    latestSyncedBlock: 0,
    syncingError: '',
  },
  reducers: {
    syncStatusRequest(state) {
      state.isLoading = true;
    },
    syncStatusSuccess(state, action) {
      state.syncedPercentage = action.payload.syncedPercentage;
      state.latestSyncedBlock = action.payload.latestSyncedBlock;
      state.latestBlock = action.payload.latestBlock;
      state.isLoading = false;
    },
    syncStatusFailure(state, action) {
      state.syncedPercentage = 0;
      state.latestSyncedBlock = 0;
      state.latestBlock = 0;
      state.isLoading = false;
      state.syncingError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  syncStatusRequest,
  syncStatusSuccess,
  syncStatusFailure,
} = actions;

export default reducer;
