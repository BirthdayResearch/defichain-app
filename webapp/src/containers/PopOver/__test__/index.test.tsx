import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Popover from '../index';

describe('Popover Index', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Popover />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
