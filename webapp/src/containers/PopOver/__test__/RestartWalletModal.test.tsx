import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import RestartWalletModal from '../index';

describe('RestartWalletModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <RestartWalletModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
