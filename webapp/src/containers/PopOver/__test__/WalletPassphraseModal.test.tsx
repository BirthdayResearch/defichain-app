import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import WalletPassphraseModal from '../index';

describe('WalletPassphraseModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <WalletPassphraseModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
