import React from 'react';
import BlockchainTable from '../components/BlockchainTable';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { mount } from 'enzyme';

describe('BlockchainTable component', () => {
  it('should check snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <BlockchainTable />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
