import React from 'react';
import WalletTxns from '../components/WalletTxns';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('WalletTxns component', () => {
  it('should check for snapshot', () => {
    const tokenSymbol = 'DFI';
    const wrapper = mount(
      <Provider store={store}>
        <WalletTxns tokenSymbol={tokenSymbol} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
