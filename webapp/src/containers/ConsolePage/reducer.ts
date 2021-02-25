import { createSlice } from '@reduxjs/toolkit';
import { ConsolePageState } from './types';

export const initialState: ConsolePageState = {
  isLoading: false,
  result: {},
  isError: '',
  cliLog: {},
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
    storeCliLog(state, action) {
      state.cliLog = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;
export const {
  fetchDataForQueryRequest,
  fetchDataForQuerySuccess,
  fetchDataForQueryFailure,
  resetDataForQuery,
  storeCliLog,
} = actions;

export default reducer;
