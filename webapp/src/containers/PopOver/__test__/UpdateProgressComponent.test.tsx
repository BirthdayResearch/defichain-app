import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import Enzyme from '../../../utils/testUtils/enzyme';
import UpdateProgressComponent from '../UpdateProgress/UpdateProgressComponent';

describe('UpdateProgressComponent', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <UpdateProgressComponent />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
