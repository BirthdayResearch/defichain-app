import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import ErrorModal from '../ErrorModal';

describe('Error Modal', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ErrorModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
