import React from 'react';
import WalletTxnsNew from '../components/WalletTxnsNew';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('WalletTxnsNew component', () => {
  it('should check for snapshot', () => {
    const tokenSymbol = 'DFI';
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <WalletTxnsNew tokenSymbol={tokenSymbol} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
