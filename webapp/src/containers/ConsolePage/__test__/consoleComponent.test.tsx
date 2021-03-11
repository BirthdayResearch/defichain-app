import React from 'react';
import ConsoleComponent from '../ConsoleComponent';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('Console component', () => {
  it('snapshot test of console component', () => {
    window.getSelection = jest.fn().mockImplementation(() => {
      return {
        toString: jest.fn(),
      };
    });
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <ConsoleComponent />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
