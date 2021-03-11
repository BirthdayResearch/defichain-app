import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import Popover from '../index';

describe('Popover Index', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <Popover />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
