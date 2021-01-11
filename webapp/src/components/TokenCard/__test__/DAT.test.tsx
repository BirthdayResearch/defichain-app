import React from 'react';
import TokenCard from '../DAT';
import { shallow } from 'enzyme';
import { toUpper } from 'lodash';

describe('TokenCard component', () => {
  it('should check for snapshot', () => {
    const data = {
      hash: 'hash',
      name: 'name',
      symbol: 'symbol',
      symbolKey: 'symbolKey',
      isDAT: true,
      decimal: 1,
      limit: 1,
      mintable: true,
      tradeable: true,
      isLPS: true,
    };
    const props = {
      data: data,
      handleCardClick: () => {},
    };
    const wrapper = shallow(<TokenCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
