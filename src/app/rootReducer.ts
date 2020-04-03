import { combineReducers } from "@reduxjs/toolkit";
import walletReducer from "../containers/WalletPage/reducer";
import { i18nReducer } from "react-redux-i18n";

export default combineReducers({ wallet: walletReducer, i18n: i18nReducer });
