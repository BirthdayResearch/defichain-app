import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../containers/RpcConfiguration/reducer';
import walletReducer from '../containers/WalletPage/reducer';
import settingsReducer from '../containers/SettingsPage/reducer';
import blockchainReducer from '../containers/BlockchainPage/reducer';
import masterNodesReducer from '../containers/MasternodesPage/reducer';
import tokensReducer from '../containers/TokensPage/reducer';
import syncStatusReducer from '../containers/SyncStatus/reducer';
import cliReducer from '../containers/ConsolePage/reducer';
import popoverReducer from '../containers/PopOver/reducer';
import { i18nReducer } from 'react-redux-i18n';

export default combineReducers({
  app: appReducer,
  wallet: walletReducer,
  settings: settingsReducer,
  blockchain: blockchainReducer,
  masterNodes: masterNodesReducer,
  tokens: tokensReducer,
  syncstatus: syncStatusReducer,
  i18n: i18nReducer,
  cli: cliReducer,
  popover: popoverReducer,
});
