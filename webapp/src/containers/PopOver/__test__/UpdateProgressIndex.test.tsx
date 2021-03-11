import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import UpdateProgress from '../UpdateProgress';

describe('UpdateProgress Index', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <UpdateProgress />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
