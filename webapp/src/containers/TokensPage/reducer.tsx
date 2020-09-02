import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  tokenInfo: {},
  tokens: [],
  transfers: [],
  isLoadingTokenInfo: false,
  isTokenInfoLoaded: false,
  isTokensLoaded: false,
  isLoadingTokens: false,
  isLoadingTransfers: false,
  isTransfersLoaded: false,
  isTokenCreating: false,
  createdTokenData: {},
  isErrorCreatingToken: '',
};

const configSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    fetchTokenInfo(state, action) {
      state.isLoadingTokenInfo = true;
    },
    fetchTokenInfoSuccess(state, action) {
      state.tokenInfo = action.payload.tokenInfo;
      state.isLoadingTokenInfo = false;
      state.isTokenInfoLoaded = true;
    },
    fetchTokenInfoFailure(state, action) {
      state.tokenInfo = {};
      state.isLoadingTokenInfo = false;
      state.isTokenInfoLoaded = true;
    },
    fetchTokensRequest(state) {
      state.isLoadingTokens = true;
    },
    fetchTokensSuccess(state, action) {
      state.tokens = action.payload.tokens;
      state.isLoadingTokens = false;
      state.isTokensLoaded = true;
    },
    fetchTokensFailure(state, action) {
      state.tokens = [];
      state.isLoadingTokens = false;
      state.isTokensLoaded = true;
    },
    fetchTransfersRequest(state, action) {
      state.isLoadingTransfers = true;
    },
    fetchTransfersSuccess(state, action) {
      state.transfers = action.payload.transfers;
      state.isLoadingTransfers = false;
      state.isTransfersLoaded = true;
    },
    fetchTransfersFailure(state, action) {
      state.tokens = [];
      state.isLoadingTokens = false;
      state.isTransfersLoaded = true;
    },
    createToken(state, action) {
      state.isTokenCreating = true;
      state.createdTokenData = {};
      state.isErrorCreatingToken = '';
    },
    createTokenSuccess(state, action) {
      state.isTokenCreating = false;
      state.createdTokenData = action.payload;
      state.isErrorCreatingToken = '';
    },
    createTokenFailure(state, action) {
      state.isTokenCreating = false;
      state.createdTokenData = {};
      state.isErrorCreatingToken = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchTokenInfo,
  fetchTokenInfoSuccess,
  fetchTokenInfoFailure,
  fetchTokensRequest,
  fetchTokensSuccess,
  fetchTokensFailure,
  fetchTransfersRequest,
  fetchTransfersFailure,
  fetchTransfersSuccess,
  createToken,
  createTokenFailure,
  createTokenSuccess,
} = actions;

export default reducer;
