import React from 'react';
import Sidebar from '../index';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Sidebar component', () => {
  it('should check for snapshot', () => {
    const props = {
      unit: 'unit',
      walletBalance: '123',
      pendingBalance: '1',
      fetchInstantBalanceRequest: () => {},
      fetchInstantPendingBalanceRequest: () => {},
      blockChainInfo: [],
    };
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <Sidebar {...props} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
