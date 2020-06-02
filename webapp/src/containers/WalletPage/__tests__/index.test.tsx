import React from 'react';
import WalletPage from '../index';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('WalletPage component', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Router>
        <Provider store={store}>
          <WalletPage />
        </Provider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
