import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "dapp",
  initialState: {
    isLanguageSet: false,
    languageSetError: "Unsupported language.",
    language: "en",
  },
  reducers: {
    setLanguageRequest(state) {
      state.isLanguageSet = true;
    },
    setLanguageSuccess(state, action) {
      state.language = action.payload.network;
      state.isLanguageSet = true;
      state.languageSetError = "";
    },
    setLanguageFailure(state, action) {
      state.isLanguageSet = false;
      state.languageSetError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  setLanguageRequest,
  setLanguageSuccess,
  setLanguageFailure,
} = actions;

export default reducer;
