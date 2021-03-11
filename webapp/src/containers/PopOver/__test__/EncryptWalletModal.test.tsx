import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import EncryptWalletModal from '../index';

describe('EncryptWalletModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <EncryptWalletModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
