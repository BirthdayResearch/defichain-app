import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import RefreshUtxosModal from '../index';

describe('RefreshUtxosModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <RefreshUtxosModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
