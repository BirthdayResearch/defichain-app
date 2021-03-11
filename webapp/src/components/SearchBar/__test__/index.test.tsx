import React from 'react';
import QrCode from '../index';
import { shallow } from 'enzyme';

describe('QrCode component', () => {
  it('should check for snapshot', () => {
    const props = {
      searching: 'searching',
      toggleSearch: 'toggleSearch',
      onChange: () => {},
      placeholder: 'placeholder',
    };
    const wrapper = shallow(<QrCode {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
