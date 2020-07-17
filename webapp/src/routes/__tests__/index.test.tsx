import React from 'react';
import { shallow } from 'enzyme';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import route from '../index';
import SendPage from '../../containers/WalletPage/components/SendPage';
import ReceivePage from '../../containers/WalletPage/components/ReceivePage';
import WalletPage from '../../containers/WalletPage';
import BlockPage from '../../containers/BlockchainPage/components/BlockPage';
import PaymentRequestPage from '../../containers/WalletPage/components/PaymentRequestPage';
import BlockchainPage from '../../containers/BlockchainPage';
import MinerPage from '../../containers/BlockchainPage/components/MinerPage';
import HelpPage from '../../containers/HelpPage';
import Error404Page from '../../containers/Errors';
import SettingsPage from '../../containers/SettingsPage';
// NOTE: To be used in future
// import ExchangePage from '../../containers/ExchangePage';
// import MasternodesPage from '../../containers/MasternodesPage';
import {
  WALLET_SEND_PATH,
  WALLET_RECEIVE_PATH,
  WALLET_PAGE_PATH,
  BLOCKCHAIN_BASE_PATH,
  HELP_PATH,
  SETTING_PATH,
  BLOCKCHAIN_BLOCK_PARAM_PATH,
  BLOCKCHAIN_MINER_PARAM_PATH,
  WALLET_PAYMENT_REQ_PARAMS_PATH,
  // NOTE: To be used in future
  // MASTER_NODES_PATH,
  // EXCHANGE_PATH,
} from '../../constants';
let pathMap = {};

describe('Routing', () => {
  beforeAll(() => {
    const component = shallow(
      <Router>
        {route({
          pathname: '/',
          search: '',
          hash: '',
          state: undefined,
        })}
      </Router>
    );
    pathMap = component.find(Route).map((item) => item.props());
  });

  it(`Should check for send on path ${WALLET_SEND_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find((item) => item.path === WALLET_SEND_PATH);
      expect(routeData.component).toBe(SendPage);
    }
  });

  it(`Should check for receive on path ${WALLET_RECEIVE_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find(
        (item) => item.path === WALLET_RECEIVE_PATH
      );
      expect(routeData.component).toBe(ReceivePage);
    }
  });

  it(`Should check for wallet page on path ${WALLET_PAGE_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find((item) => item.path === WALLET_PAGE_PATH);
      expect(routeData.component).toBe(WalletPage);
    }
  });

  it(`Should check for blockchain on path ${BLOCKCHAIN_BASE_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find(
        (item) => item.path === BLOCKCHAIN_BASE_PATH
      );
      expect(routeData.component).toBe(BlockchainPage);
    }
  });

  // NOTE: To be used in future
  // it(`Should check for exchange on path ${EXCHANGE_PATH}`, () => {
  //   if (Array.isArray(pathMap)) {
  //     const routeData = pathMap.find(item => item.path === EXCHANGE_PATH);
  //     expect(routeData.component).toBe(ExchangePage);
  //   }
  // });

  it(`Should check for help on path ${HELP_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find((item) => item.path === HELP_PATH);
      expect(routeData.component).toBe(HelpPage);
    }
  });

  // NOTE: To be used in future
  // it(`Should check for master nodes on path ${MASTER_NODES_PATH}`, () => {
  //   if (Array.isArray(pathMap)) {
  //     const routeData = pathMap.find(item => item.path === MASTER_NODES_PATH);
  //     expect(routeData.component).toBe(MasternodesPage);
  //   }
  // });

  it(`Should check for setting on path ${SETTING_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find((item) => item.path === SETTING_PATH);
      expect(routeData.component).toBe(SettingsPage);
    }
  });

  it(`Should check for blockchain block on path ${BLOCKCHAIN_BLOCK_PARAM_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find(
        (item) => item.path === BLOCKCHAIN_BLOCK_PARAM_PATH
      );
      expect(routeData.component).toBe(BlockPage);
    }
  });

  it(`Should check for blockchain miner on path ${BLOCKCHAIN_MINER_PARAM_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find(
        (item) => item.path === BLOCKCHAIN_MINER_PARAM_PATH
      );
      expect(routeData.component).toBe(MinerPage);
    }
  });

  it(`Should check for wallet payment request on path ${WALLET_PAYMENT_REQ_PARAMS_PATH}`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find(
        (item) => item.path === WALLET_PAYMENT_REQ_PARAMS_PATH
      );
      expect(routeData.component).toBe(PaymentRequestPage);
    }
  });

  it(`Should check for Error Path`, () => {
    if (Array.isArray(pathMap)) {
      const routeData = pathMap.find((item) => !item.path);
      expect(routeData.component).toBe(Error404Page);
    }
  });
});
