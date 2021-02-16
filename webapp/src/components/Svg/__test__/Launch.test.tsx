import React from 'react';
import Launch from '../Launch';
import { shallow } from 'enzyme';

describe('Launch component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<Launch />);
    expect(wrapper).toMatchSnapshot();
  });
});
