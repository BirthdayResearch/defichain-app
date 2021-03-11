import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import WalletPage from '../containers/WalletPage';
import WalletTokensPage from '../containers/WalletPage/components/Tokens/TokensList';
import WalletAddToken from '../containers/WalletPage/components/Tokens/AddToken';
import SendPage from '../containers/WalletPage/components/SendPage';
import ReceivePage from '../containers/WalletPage/components/ReceivePage';
import CreateNewAddressPage from '../containers/WalletPage/components/ReceivePage/CreateNewAddressPage';
import PaymentRequestPage from '../containers/WalletPage/components/PaymentRequestPage';
import BlockchainPage from '../containers/BlockchainPage';
import BlockPage from '../containers/BlockchainPage/components/BlockPage';
import MinerPage from '../containers/BlockchainPage/components/MinerPage';
import ConsolePage from '../containers/ConsolePage';
import MasternodesPage from '../containers/MasternodesPage'; //  NOTE: Do not remove, for future purpose
import MasterNodeDetailPageProps from '../containers/MasternodesPage/components/MasterNodeDetailPage';

// import ExchangePage from '../containers/ExchangePage'; //  NOTE: Do not remove, for future purpose
import HelpPage from '../containers/HelpPage';
import Error404Page from '../containers/Errors';
import SettingsPage from '../containers/SettingsPage';
import TokensPage from '../containers/TokensPage';
import CreateToken from '../containers/TokensPage/components/CreateToken';
import TokenInfo from '../containers/TokensPage/components/TokenInfo';
import {
  BLOCKCHAIN_BASE_PATH,
  HELP_PATH,
  INDEX_PATH,
  // EXCHANGE_PATH, //  NOTE: Do not remove, for future purpose
  MASTER_NODES_PATH, //  NOTE: Do not remove, for future purpose
  SETTING_PATH,
  WALLET_PAGE_PATH,
  WALLET_SEND_PATH,
  WALLET_RECEIVE_PATH,
  BLOCKCHAIN_BLOCK_PARAM_PATH,
  BLOCKCHAIN_MINER_PARAM_PATH,
  WALLET_PAYMENT_REQ_PARAMS_PATH,
  CONSOLE_RPC_CALL_BASE_PATH,
  MASTER_NODES_DETAIL_PATH,
  WALLET_CREATE_RECEIVE_REQUEST,
  TOKENS_PATH,
  CREATE_TOKENS_PATH,
  WALLET_ADD_TOKEN_PATH,
  TOKENS_INFO_PATH,
  EDIT_TOKENS_PATH,
  WALLET_TOKENS_PATH,
  WALLET_BASE_PATH,
  WALLET_RESTORE_PAGE_PATH,
  WALLET_CREATE_PATH,
  SWAP_PATH,
  CREATE_POOL_PAIR_PATH,
  MINT_TOKENS_PATH,
  REMOVE_LIQUIDITY,
  LIQUIDITY_PATH,
  WALLET_SYNC_PAGE_PATH,
  LIQUIDITY_INFO_PATH,
  WALLET_ENCRYPT_PATH,
  WALLET_UNLOCK_PATH,
  SETTINGS_CHANGE_PASSPHRASE,
} from '../constants';
import CreateWallet from '../containers/WalletPage/components/CreateWallet';
import RestoreWallet from '../containers/WalletPage/components/RestoreWallet';
import WalletSyncPage from '../containers/WalletPage/components/CreateOrRestoreWalletPage/WalletSyncPage';
import CreateOrRestoreWalletPage from '../containers/WalletPage/components/CreateOrRestoreWalletPage';
import SwapPage from '../containers/SwapPage';
import AddLiquidityPage from '../containers/LiquidityPage/components/AddLiquidity';
import RemoveLiquidityPage from '../containers/LiquidityPage/components/RemoveLiquidity';
import MintToken from '../containers/TokensPage/components/MintToken';
import LiquidityPage from '../containers/LiquidityPage';
import LiquidityInfo from '../containers/LiquidityPage/components/LiquidityInfo';
import EncryptWalletPage from '../containers/WalletPage/components/EncryptWalletPage';
import WalletPassphrasePage from '../containers/WalletPage/components/WalletPassphrasePage';
import SettingsChangePassphrase from '../containers/SettingsPage/components/SettingsChangePassphrase';

const routes = (location) => (
  <Switch location={location}>
    <Redirect from={INDEX_PATH} to={WALLET_TOKENS_PATH} />
    <Route exact path={WALLET_PAGE_PATH} component={WalletPage} />
    <Route exact path={WALLET_SEND_PATH} component={SendPage} />
    <Route exact path={WALLET_RECEIVE_PATH} component={ReceivePage} />
    <Route exact path={WALLET_CREATE_PATH} component={CreateWallet} />
    <Route
      exact
      path={WALLET_BASE_PATH}
      component={CreateOrRestoreWalletPage}
    />
    <Route exact path={WALLET_RESTORE_PAGE_PATH} component={RestoreWallet} />
    <Route
      exact
      path={WALLET_CREATE_RECEIVE_REQUEST}
      component={CreateNewAddressPage}
    />
    <Route
      exact
      path={WALLET_PAYMENT_REQ_PARAMS_PATH}
      component={PaymentRequestPage}
    />
    {/* NOTE: Do not remove, for future purpose */}
    <Route exact path={MASTER_NODES_PATH} component={MasternodesPage} />
    <Route
      exact
      path={MASTER_NODES_DETAIL_PATH}
      component={MasterNodeDetailPageProps}
    />
    {/* <Route exact path={EXCHANGE_PATH} component={ExchangePage} /> */}
    <Route exact path={BLOCKCHAIN_BASE_PATH} component={BlockchainPage} />
    <Route exact path={TOKENS_PATH} component={TokensPage} />
    <Route exact path={SWAP_PATH} component={SwapPage} />
    <Route exact path={LIQUIDITY_PATH} component={LiquidityPage} />
    <Route exact path={CREATE_TOKENS_PATH} component={CreateToken} />
    <Route exact path={MINT_TOKENS_PATH} component={MintToken} />
    <Route exact path={WALLET_TOKENS_PATH} component={WalletTokensPage} />
    <Route exact path={WALLET_SYNC_PAGE_PATH} component={WalletSyncPage} />
    <Route exact path={WALLET_ENCRYPT_PATH} component={EncryptWalletPage} />
    <Route exact path={WALLET_UNLOCK_PATH} component={WalletPassphrasePage} />
    <Route exact path={WALLET_ADD_TOKEN_PATH} component={WalletAddToken} />
    <Route exact path={EDIT_TOKENS_PATH} component={CreateToken} />
    <Route exact path={TOKENS_INFO_PATH} component={TokenInfo} />
    <Route exact path={BLOCKCHAIN_BLOCK_PARAM_PATH} component={BlockPage} />
    <Route exact path={BLOCKCHAIN_MINER_PARAM_PATH} component={MinerPage} />
    <Route exact path={HELP_PATH} component={HelpPage} />
    <Route exact path={SETTING_PATH} component={SettingsPage} />
    <Route
      exact
      path={SETTINGS_CHANGE_PASSPHRASE}
      component={SettingsChangePassphrase}
    />
    <Route exact path={CONSOLE_RPC_CALL_BASE_PATH} component={ConsolePage} />
    <Route exact path={CREATE_POOL_PAIR_PATH} component={AddLiquidityPage} />
    <Route exact path={REMOVE_LIQUIDITY} component={RemoveLiquidityPage} />
    <Route exact path={LIQUIDITY_INFO_PATH} component={LiquidityInfo} />
    <Route exact component={Error404Page} />
  </Switch>
);

export default routes;
