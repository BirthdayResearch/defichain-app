import { createSlice } from '@reduxjs/toolkit';
import { SyncStatusState } from './types';

export const initialState: SyncStatusState = {
  isLoading: false,
  syncedPercentage: 0,
  latestBlock: 0,
  latestSyncedBlock: 0,
  syncingError: '',
  isPeersLoading: true,
  peers: 0,
  peersError: '',
};
const configSlice = createSlice({
  name: 'syncstatus',
  initialState,
  reducers: {
    syncStatusPeersRequest(state) {
      state.isPeersLoading = true;
    },
    syncStatusPeersLoading(state, action) {
      state.isPeersLoading = action.payload.isLoading;
    },
    syncStatusPeersSuccess(state, action) {
      state.peers = action.payload.peers;
      state.peersError = '';
    },
    syncStatusPeersFailure(state, action) {
      state.isPeersLoading = false;
      state.peers = 0;
      state.peersError = action.payload.error;
    },
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
  syncStatusPeersRequest,
  syncStatusPeersLoading,
  syncStatusPeersSuccess,
  syncStatusPeersFailure,
} = actions;

export default reducer;
