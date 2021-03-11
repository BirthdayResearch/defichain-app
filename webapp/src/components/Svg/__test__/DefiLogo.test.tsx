import React from 'react';
import Logo from '../DefiLogo';
import { shallow } from 'enzyme';

describe('Logo component', () => {
  it('should check for snapshot', () => {
    const wrapper = shallow(<Logo />);
    expect(wrapper).toMatchSnapshot();
  });
});
