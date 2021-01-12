import React from 'react';
import CreateToken from '../components/CreateToken';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('Create token page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <CreateToken {...routeComponentProps} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
