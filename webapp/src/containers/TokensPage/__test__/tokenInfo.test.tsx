import React from 'react';
import TokenInfo from '../components/TokenInfo/index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('Token info page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <TokenInfo {...routeComponentProps} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
