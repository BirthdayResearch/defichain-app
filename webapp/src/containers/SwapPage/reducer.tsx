import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  poolPairList: {},
};

const configSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    fetchPoolPairListRequest(state) {},
    fetchPoolPairListSuccess(state, action) {
      state.poolPairList = action.payload;
    },
    fetchPoolPairListFailure(state) {},
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchPoolPairListRequest,
  fetchPoolPairListSuccess,
  fetchPoolPairListFailure,
} = actions;

export default reducer;
