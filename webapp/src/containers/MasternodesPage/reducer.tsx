import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'masternode',
  initialState: {
    masternodes: [],
    isMasternodesLoaded: false,
    isLoadingMasternodes: false,
    masternodesLoadError: '',
  },
  reducers: {
    fetchMasternodesRequest(state) {
      state.masternodes = [];
      state.isLoadingMasternodes = true;
    },
    fetchMasternodesSuccess(state, action) {
      state.masternodes = action.payload.masternodes;
      state.isLoadingMasternodes = false;
      state.isMasternodesLoaded = true;
    },
    fetchMasternodesFailure(state, action) {
      state.masternodes = [];
      state.isLoadingMasternodes = false;
      state.isMasternodesLoaded = true;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
} = actions;

export default reducer;
