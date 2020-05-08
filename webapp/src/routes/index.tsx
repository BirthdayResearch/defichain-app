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
import ExchangePage from '../containers/ExchangePage/ExchangePage';
import HelpPage from '../containers/HelpPage/HelpPage';
import Error404Page from '../containers/Errors/Error404Page';
import SettingsPage from '../containers/SettingsPage';

const routes = (location) => (
  <Switch location={location}>
    <Redirect from='/index.html' to='/' />
    <Route exact path='/' component={WalletPage} />
    <Route exact path='/wallet/send' component={SendPage} />
    <Route exact path='/wallet/receive' component={ReceivePage} />
    <Route
      exact
      path='/wallet/paymentrequest/:id'
      component={PaymentRequestPage}
    />
    <Route exact path='/masternodes' component={MasternodesPage} />
    <Route exact path='/blockchain' component={BlockchainPage} />
    <Route
      exact
      path='/blockchain/block/:height'
      component={BlockPage}
    />
    <Route
      exact
      path='/blockchain/miner/:id'
      component={MinerPage}
    />
    <Route exact path='/exchange' component={ExchangePage} />
    <Route exact path='/help' component={HelpPage} />
    <Route exact path='/settings' component={SettingsPage} />
    <Route exact component={Error404Page} />
  </Switch>
);

export default routes;
