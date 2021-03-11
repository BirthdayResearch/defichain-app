import React from 'react';
import BlockchainTable from '../components/BlockchainTable';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('BlockchainTable component', () => {
  it('should check snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <BlockchainTable />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
