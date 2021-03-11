import React from 'react';
import WalletAddTokenCard from '../WalletAddTokenCard';
import { shallow } from 'enzyme';

describe('WalletAddTokenCard component', () => {
  it('should check for snapshot', () => {
    const IWalletTokenCard = {
      symbolKey: 'symbolKey',
      hash: 'hash',
      name: 'name',
      symbol: 'symbol',
      isDAT: true,
      isLPS: true,
      decimal: 1,
      limit: 1,
      mintable: true,
      tradeable: true,
      creationTx: 'creationTx',
      creationHeight: 2,
      destructionTx: 'destructionTx',
      destructionHeight: 1,
      amount: 1,
      address: 'address',
    };
    const props = {
      token: IWalletTokenCard,
    };
    const wrapper = shallow(<WalletAddTokenCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
