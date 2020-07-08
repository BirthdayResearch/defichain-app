import React from 'react';
import { shallow } from 'enzyme';
import ConsolePage from '../index';

describe('Console Page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<ConsolePage />);
    expect(wrapper).toMatchSnapshot();
  });
});
