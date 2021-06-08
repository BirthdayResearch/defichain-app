import React from 'react';
import MintToken from '../components/MintToken';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { match } from 'react-router';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';
const path = `/route/:hash`;

describe('Mint token page', () => {
  it('should check for snapshot', () => {
    const match: match<{ hash: string }> = {
      isExact: false,
      path,
      url: path.replace(':hash', '1'),
      params: { hash: '1' },
    };
    const wrapper = shallow(
      <Provider store={store}>
        <MintToken {...routeComponentProps} match={match} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
