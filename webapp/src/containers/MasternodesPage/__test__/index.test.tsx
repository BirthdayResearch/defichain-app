import React from 'react';
import Masternode from '../index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('Masternode Chart', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Masternode {...routeComponentProps} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
