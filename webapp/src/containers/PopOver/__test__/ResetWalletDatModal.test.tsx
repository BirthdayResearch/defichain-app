import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import ResetWalletDatModal from '../index';

describe('ResetWalletDatModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ResetWalletDatModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
