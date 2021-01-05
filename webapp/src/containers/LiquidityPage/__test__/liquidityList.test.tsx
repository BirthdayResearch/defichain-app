import React from 'react';
import LiquidityList from '../components/LiquidityList';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('LiquidityList component', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Provider store={store}>
          <LiquidityList poolshares={[]} />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
