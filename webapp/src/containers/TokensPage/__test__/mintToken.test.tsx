import React from 'react';
import MintToken from '../components/MintToken';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('Mint token page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <MintToken {...routeComponentProps} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
