import React from 'react';
import Loader from '../index';
import { shallow } from 'enzyme';

describe('Loader component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper).toMatchSnapshot();
  });
});
