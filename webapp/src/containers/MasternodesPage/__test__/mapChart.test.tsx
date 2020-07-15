import React from 'react';
import MapChart from '../components/MapChart';
import { shallow } from 'enzyme';

describe('Map Chart', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<MapChart />);
    expect(wrapper).toMatchSnapshot();
  });
});
