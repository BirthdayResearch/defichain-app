import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import ShowUpdateAvailable from '../UpdateProgress/ShowUpdateAvailable';

describe('ShowUpdateAvailable', () => {
  it('should check for snapshot', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ShowUpdateAvailable closeModal={() => {}} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
