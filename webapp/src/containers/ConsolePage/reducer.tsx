import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  isLoading: false,
  result: {},
  isError: '',
};

const configSlice = createSlice({
  name: 'cli',
  initialState,
  reducers: {
    fetchDataForQueryRequest(state, action) {
      state.isLoading = true;
      state.result = {};
      state.isError = '';
    },
    fetchDataForQuerySuccess(state, action) {
      state.isLoading = false;
      state.result = action.payload;
      state.isError = '';
    },
    fetchDataForQueryFailure(state, action) {
      state.isLoading = false;
      state.result = {};
      state.isError = action.payload;
    },
    resetDataForQuery(state) {
      state.isLoading = false;
      state.result = {};
      state.isError = '';
    },
  },
});

const { actions, reducer } = configSlice;
export const {
  fetchDataForQueryRequest,
  fetchDataForQuerySuccess,
  fetchDataForQueryFailure,
  resetDataForQuery,
} = actions;

export default reducer;
