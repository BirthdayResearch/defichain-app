import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import WalletPage from '../containers/WalletPage';
import SendPage from '../containers/WalletPage/components/SendPage';
import ReceivePage from '../containers/WalletPage/components/ReceivePage';
import PaymentRequestPage from '../containers/WalletPage/components/PaymentRequestPage';
import MasternodesPage from '../containers/MasternodesPage';
import BlockchainPage from '../containers/BlockchainPage/BlockchainPage';
import BlockPage from '../containers/BlockchainPage/BlockPage';
import MinerPage from '../containers/BlockchainPage/MinerPage';
import ExchangePage from '../containers/ExchangePage';
import HelpPage from '../containers/HelpPage';
import Error404Page from '../containers/Errors';
import SettingsPage from '../containers/SettingsPage';
import {
  BLOCKCHAIN_BASE_PATH,
  EXCHANGE_PATH,
  HELP_PATH,
  INDEX_PATH,
  MASTER_NODES_PATH,
  SETTING_PATH,
  WALLET_PAGE_PATH,
  WALLET_SEND_PATH,
  WALLET_RECEIVE_PATH,
  BLOCKCHAIN_BLOCK_PARAM_PATH,
  BLOCKCHAIN_MINER_PARAM_PATH,
  WALLET_PAYMENT_REQ_PARAMS_PATH,
} from '../constants';

const routes = location => (
  <Switch location={location}>
    <Redirect from={INDEX_PATH} to={WALLET_PAGE_PATH} />
    <Route exact path={WALLET_PAGE_PATH} component={WalletPage} />
    <Route exact path={WALLET_SEND_PATH} component={SendPage} />
    <Route exact path={WALLET_RECEIVE_PATH} component={ReceivePage} />
    <Route
      exact
      path={WALLET_PAYMENT_REQ_PARAMS_PATH}
      component={PaymentRequestPage}
    />
    <Route exact path={MASTER_NODES_PATH} component={MasternodesPage} />
    <Route exact path={BLOCKCHAIN_BASE_PATH} component={BlockchainPage} />
    <Route exact path={BLOCKCHAIN_BLOCK_PARAM_PATH} component={BlockPage} />
    <Route exact path={BLOCKCHAIN_MINER_PARAM_PATH} component={MinerPage} />
    <Route exact path={EXCHANGE_PATH} component={ExchangePage} />
    <Route exact path={HELP_PATH} component={HelpPage} />
    <Route exact path={SETTING_PATH} component={SettingsPage} />
    <Route exact component={Error404Page} />
  </Switch>
);

export default routes;
