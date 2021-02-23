import { createSlice } from '@reduxjs/toolkit';
import { TokensState } from './types';

export const initialState: TokensState = {
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
  isTokenMinting: false,
  mintedTokenData: {},
  isErrorMintingToken: '',
  isTokenUpdating: false,
  updatedTokenData: {},
  isErrorUpdatingToken: '',
  isTokenDestroying: false,
  destroyTokenData: '',
  isErrorDestroyingToken: '',
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
    mintToken(state, action) {
      state.isTokenMinting = true;
      state.mintedTokenData = {};
      state.isErrorMintingToken = '';
    },
    mintTokenSuccess(state, action) {
      state.isTokenMinting = false;
      state.mintedTokenData = action.payload;
      state.isErrorMintingToken = '';
    },
    mintTokenFailure(state, action) {
      state.isTokenMinting = false;
      state.mintedTokenData = {};
      state.isErrorMintingToken = action.payload;
    },
    updateToken(state, action) {
      state.isTokenUpdating = true;
      state.updatedTokenData = {};
      state.isErrorUpdatingToken = '';
    },
    updateTokenSuccess(state, action) {
      state.isTokenUpdating = false;
      state.updatedTokenData = action.payload;
      state.isErrorUpdatingToken = '';
    },
    updateTokenFailure(state, action) {
      state.isTokenUpdating = false;
      state.updatedTokenData = {};
      state.isErrorUpdatingToken = action.payload;
    },
    destroyToken(state, action) {
      state.isTokenDestroying = true;
      state.destroyTokenData = '';
      state.isErrorDestroyingToken = '';
    },
    destroyTokenSuccess(state, action) {
      state.isTokenDestroying = false;
      state.destroyTokenData = action.payload;
      state.isErrorDestroyingToken = '';
    },
    destroyTokenFailure(state, action) {
      state.isTokenDestroying = false;
      state.destroyTokenData = '';
      state.isErrorDestroyingToken = action.payload;
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
  mintToken,
  mintTokenFailure,
  mintTokenSuccess,
  updateToken,
  updateTokenSuccess,
  updateTokenFailure,
  destroyToken,
  destroyTokenFailure,
  destroyTokenSuccess,
} = actions;

export default reducer;
