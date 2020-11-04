import React from 'react';
import TokensPage from '../index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('TokensPage Chart', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <TokensPage {...routeComponentProps} searchQuery={''} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
