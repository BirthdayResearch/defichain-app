import React from 'react';
import PairIcon from '../index';
import { shallow } from 'enzyme';

describe('PairIcon component', () => {
  it('should check for snapshot', () => {
    const props = {
      poolpair: [],
    };
    const wrapper = shallow(<PairIcon {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
