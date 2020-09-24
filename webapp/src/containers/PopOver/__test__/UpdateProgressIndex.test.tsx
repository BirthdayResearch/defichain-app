import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import UpdateProgress from '../UpdateProgress';

describe('UpdateProgress Index', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <UpdateProgress />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
