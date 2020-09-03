import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  masternodes: [],
  isMasternodesLoaded: false,
  isLoadingMasternodes: false,
  masternodesLoadError: '',
  isMasterNodeCreating: false,
  createdMasterNodeData: {},
  isErrorCreatingMasterNode: '',
  isMasterNodeResigning: false,
  resignedMasterNodeData: '',
  isErrorResigningMasterNode: '',
  isRestartNode: false,
};

const configSlice = createSlice({
  name: 'masternode',
  initialState,
  reducers: {
    fetchMasternodesRequest(state) {
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
    createMasterNode(state) {
      state.isMasterNodeCreating = true;
      state.createdMasterNodeData = {};
      state.isErrorCreatingMasterNode = '';
    },
    createMasterNodeSuccess(state, action) {
      state.isMasterNodeCreating = false;
      state.createdMasterNodeData = action.payload;
      state.isErrorCreatingMasterNode = '';
    },
    createMasterNodeFailure(state, action) {
      state.isMasterNodeCreating = false;
      state.createdMasterNodeData = {};
      state.isErrorCreatingMasterNode = action.payload;
    },
    resignMasterNode(state, action) {
      state.isMasterNodeResigning = true;
      state.resignedMasterNodeData = '';
      state.isErrorResigningMasterNode = '';
    },
    resignMasterNodeSuccess(state, action) {
      state.isMasterNodeResigning = false;
      state.resignedMasterNodeData = action.payload;
      state.isErrorResigningMasterNode = '';
    },
    resignMasterNodeFailure(state, action) {
      state.isMasterNodeResigning = false;
      state.resignedMasterNodeData = '';
      state.isErrorResigningMasterNode = action.payload;
    },
    startRestartNodeWithMasterNode(state) {
      state.isRestartNode = true;
    },
    finishRestartNodeWithMasterNode(state) {
      state.isRestartNode = false;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
  createMasterNode,
  createMasterNodeSuccess,
  createMasterNodeFailure,
  resignMasterNode,
  resignMasterNodeSuccess,
  resignMasterNodeFailure,
  startRestartNodeWithMasterNode,
  finishRestartNodeWithMasterNode,
} = actions;

export default reducer;
