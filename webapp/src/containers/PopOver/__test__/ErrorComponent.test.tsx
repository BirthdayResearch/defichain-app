import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import ErrorComponent from '../UpdateProgress/ErrorComponent';

describe('ErrorComponent', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <ErrorComponent />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
