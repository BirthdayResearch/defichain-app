import { createSlice } from '@reduxjs/toolkit';
import { RESIGNED_STATE } from '../../constants';
import { MasternodesState } from './types';

export const initialState: MasternodesState = {
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
  myMasternodes: [],
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
      state.myMasternodes = state.masternodes.filter(
        (masternode) =>
          masternode.state !== RESIGNED_STATE && masternode.isMyMasternode
      );
    },
    fetchMasternodesFailure(state, action) {
      state.masternodes = [];
      state.isLoadingMasternodes = false;
      state.isMasternodesLoaded = true;
      state.myMasternodes = [];
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
    updateMasternodeStart(state, action) {},
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
  updateMasternodeStart,
} = actions;

export default reducer;
