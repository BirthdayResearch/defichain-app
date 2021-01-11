import React from 'react';
import SwapSearchBar from '../index';
import { shallow } from 'enzyme';

describe('SwapSearchBar component', () => {
  it('should check for snapshot', () => {
    const props = {
      searching: 'searching',
      onChange: () => {},
      placeholder: 'placeholder',
    };
    const wrapper = shallow(<SwapSearchBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
