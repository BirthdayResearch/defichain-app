import React from 'react';
import LiquidityList from '../components/LiquidityList';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import { history } from '../../../utils/testUtils/routeComponentProps';
import { poolshare } from './testData.json';

describe('LiquidityList component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <LiquidityList poolshares={poolshare} {...history} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
