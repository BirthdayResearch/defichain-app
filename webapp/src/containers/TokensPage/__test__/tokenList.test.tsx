import React from 'react';
import TokenList from '../components/TokenList';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../../app/rootStore';
import DATTokenCard from '../../../components/TokenCard/DAT';

import * as routeComponentProps from '../../../utils/testUtils/routeComponentProps';

describe('TokenList component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <TokenList
          {...routeComponentProps}
          tokens={[]}
          searchQuery={''}
          handleCardClick={() => {
            return '';
          }}
          component={DATTokenCard}
          isLoadingTokens={false}
        />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
