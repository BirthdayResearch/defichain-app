import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import ErrorModal from '../ErrorModal';

describe('Error Modal', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <ErrorModal />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
