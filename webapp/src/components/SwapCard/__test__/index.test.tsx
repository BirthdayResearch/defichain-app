import React from 'react';
import StatCard from '../index';
import { shallow } from 'enzyme';

describe('StatCard component', () => {
  it('should check for snapshot', () => {
    const props = {
      label: 'label',
      dropdownLabel: 'dropdownLabel',
      tokenMap: new Map(),
      name: 1,
      formState: 'formState',
      handleChange: () => {},
      setMaxValue: () => {},
      isLoadingTestPoolSwapTo: true,
      isLoadingTestPoolSwapFrom: true,
      handleDropdown: () => {},
    };
    const wrapper = shallow(<StatCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
