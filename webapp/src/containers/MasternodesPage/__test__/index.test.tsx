import React from 'react';
import Masternode from '../index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

describe('Masternode Chart', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Masternode />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
