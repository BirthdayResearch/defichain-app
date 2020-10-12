import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import WalletPage from '../containers/WalletPage';
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
  WALLET_BASE_PATH,
  WALLET_RESTORE_PAGE_PATH,
  WALLET_CREATE_PATH,
} from '../constants';
import CreateWallet from '../containers/WalletPage/components/CreateWallet';
import RestoreWallet from '../containers/WalletPage/components/RestoreWallet';
import CreateOrRestoreWalletPage from '../containers/WalletPage/components/CreateOrRestoreWalletPage';

const routes = (location) => (
  <Switch location={location}>
    <Redirect from={INDEX_PATH} to={WALLET_PAGE_PATH} />
    <Route exact path={WALLET_PAGE_PATH} component={WalletPage} />
    <Route exact path={WALLET_SEND_PATH} component={SendPage} />
    <Route exact path={WALLET_RECEIVE_PATH} component={ReceivePage} />
    <Route exact path={WALLET_BASE_PATH} component={CreateWallet} />
    <Route
      exact
      path={WALLET_CREATE_PATH}
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
    <Route exact path={BLOCKCHAIN_BLOCK_PARAM_PATH} component={BlockPage} />
    <Route exact path={BLOCKCHAIN_MINER_PARAM_PATH} component={MinerPage} />
    <Route exact path={HELP_PATH} component={HelpPage} />
    <Route exact path={SETTING_PATH} component={SettingsPage} />
    <Route exact path={CONSOLE_RPC_CALL_BASE_PATH} component={ConsolePage} />
    <Route exact component={Error404Page} />
  </Switch>
);

export default routes;
