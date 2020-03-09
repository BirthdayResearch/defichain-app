import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Route, Redirect } from 'react-router-dom';
import './App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import SyncStatus from './components/SyncStatus/SyncStatus';
import WalletPage from './containers/WalletPage/WalletPage';
import SendPage from './containers/WalletPage/SendPage';
import ReceivePage from './containers/WalletPage/ReceivePage';
import MasternodesPage from './containers/MasternodesPage/MasternodesPage';
import BlockchainPage from './containers/BlockchainPage/BlockchainPage';
import ExchangePage from './containers/ExchangePage/ExchangePage';
import HelpPage from './containers/HelpPage/HelpPage';
import SettingsPage from './containers/SettingsPage/SettingsPage';

class App extends Component {
  render() {
    return (
      <div id="app">
        <Helmet>
          <title>DeFi Blockchain Client</title>
        </Helmet>
        <Sidebar />
        <main>
          <SyncStatus />
          <Redirect from="/" exact to="/wallet" />
          <Route path="/wallet" exact component={WalletPage} />
          <Route path="/wallet/send" component={SendPage} />
          <Route path="/wallet/receive" component={ReceivePage} />
          <Route path="/masternodes" component={MasternodesPage} />
          <Route path="/blockchain" component={BlockchainPage} />
          <Route path="/exchange" component={ExchangePage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/settings" component={SettingsPage} />
        </main>
      </div>
    );
  }
}

export default App;