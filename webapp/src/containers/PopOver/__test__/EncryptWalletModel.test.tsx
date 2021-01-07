import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import EncryptWalletModel from '../index';

describe('EncryptWalletModel', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <EncryptWalletModel />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
