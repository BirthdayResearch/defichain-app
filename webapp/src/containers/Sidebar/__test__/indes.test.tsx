import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from '../index';

describe('Sidebar Page', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<Sidebar />);
    expect(wrapper).toMatchSnapshot();
  });
});
