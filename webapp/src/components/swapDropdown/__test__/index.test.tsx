import React from 'react';
import SwapDropdown from '../index';
import { shallow } from 'enzyme';

describe('SwapDropdown component', () => {
  it('should check for snapshot', () => {
    const props = {
      tokenMap: new Map(),
      name: 1,
      formState: 'formState',
      handleDropdown: () => {},
      dropdownLabel: 'dropdownLabel',
    };
    const wrapper = shallow(<SwapDropdown {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
