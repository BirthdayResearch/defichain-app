import React from 'react';
import LiquidityCard from '../index';
import { shallow } from 'enzyme';

describe('LiquidityCard component', () => {
  it('should check for snapshot', () => {
    const props = {
      label: 'label',
      dropdownLabel: 'dropdownLabel',
      tokenMap: new Map(),
      name: 1,
      formState: {},
      handleChange: () => {},
      setMaxValue: () => {},
      handleDropdown: () => {},
    };

    const wrapper = shallow(<LiquidityCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
