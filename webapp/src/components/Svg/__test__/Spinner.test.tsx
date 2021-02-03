import React from 'react';
import Spinner from '../Spinner';
import { shallow } from 'enzyme';

describe('Spinner component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<Spinner />);
    expect(wrapper).toMatchSnapshot();
  });
});
