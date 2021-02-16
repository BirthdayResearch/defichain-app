import React from 'react';
import TokenInfo from '../components/TokenInfo/index';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import { match } from 'react-router';
import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';
const path = `/route/:hash`;

describe('Token info page', () => {
  const match: match<{ hash: string }> = {
    isExact: false,
    path,
    url: path.replace(':hash', '1'),
    params: { hash: '1' },
  };

  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <TokenInfo {...routeComponentProps} match={match} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
