import React from 'react';
import WalletTxns from '../components/WalletTxns';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('WalletTxns component', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <WalletTxns />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
