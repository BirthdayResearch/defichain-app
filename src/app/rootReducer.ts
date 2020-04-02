import { combineReducers } from "@reduxjs/toolkit";
import walletReducer from "../containers/WalletPage/reducer";

export default combineReducers({ wallet: walletReducer });
