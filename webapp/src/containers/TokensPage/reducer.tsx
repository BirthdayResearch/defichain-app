import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  tokenInfo: {},
  tokens: [],
  isLoadingTokenInfo: false,
  isTokenInfoLoaded: false,
  isTokensLoaded: false,
  isLoadingTokens: false,
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
} = actions;

export default reducer;
