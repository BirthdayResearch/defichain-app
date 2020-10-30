import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  poolshares: [],
  isPoolsharesLoaded: false,
  isLoadingPoolshares: false,
};

const configSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    fetchPoolsharesRequest(state) {
      state.isPoolsharesLoaded = true;
    },
    fetchPoolsharesSuccess(state, action) {
      state.poolshares = action.payload.poolshares;
      state.isPoolsharesLoaded = false;
      state.isLoadingPoolshares = true;
    },
    fetchPoolsharesFailure(state) {
      state.poolshares = [];
      state.isLoadingPoolshares = false;
      state.isPoolsharesLoaded = true;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchPoolsharesRequest,
  fetchPoolsharesSuccess,
  fetchPoolsharesFailure,
} = actions;

export default reducer;
