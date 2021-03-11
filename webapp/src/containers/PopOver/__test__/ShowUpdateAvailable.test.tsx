import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import ShowUpdateAvailable from '../UpdateProgress/ShowUpdateAvailable';
import Enzyme from '../../../utils/testUtils/enzyme';

describe('ShowUpdateAvailable', () => {
  it('should check for snapshot', () => {
    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <ShowUpdateAvailable closeModal={() => {}} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
