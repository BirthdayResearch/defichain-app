import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import WalletPassphraseModel from '../index';

describe('WalletPassphraseModel', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <WalletPassphraseModel />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
