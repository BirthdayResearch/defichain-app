import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import GeneralReIndexModal from '../index';

describe('GeneralReIndexModal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GeneralReIndexModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
