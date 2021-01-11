import React from 'react';
import StatCard from '../index';
import { shallow } from 'enzyme';

describe('StatCard component', () => {
  it('should check for snapshot', () => {
    const props = {
      label: 'label',
      value: 'value',
      unit: 'unit',
      icon: 'icon',
      refreshFlag: true,
    };
    const wrapper = shallow(<StatCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
