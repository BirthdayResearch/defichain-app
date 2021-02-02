import React from 'react';
import NumberMask from '../index';
import { shallow } from 'enzyme';

describe('NumberMask component', () => {
  it('should check for snapshot', () => {
    const props = {
      value: 'value',
      defaultValue: 'defaultValue',
    };
    const wrapper = shallow(<NumberMask {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
